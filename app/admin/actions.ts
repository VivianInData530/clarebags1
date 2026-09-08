'use server'

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const ADMIN_COOKIE = 'clarebags_admin'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase server credentials are not configured')
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

async function requireAdmin() {
  const cookieStore = await cookies()
  if (cookieStore.get(ADMIN_COOKIE)?.value !== 'authenticated') redirect('/admin')
}

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get('password') || '')
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || password !== adminPassword) {
    redirect('/admin?error=invalid-password')
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, 'authenticated', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
  redirect('/admin')
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
  redirect('/admin')
}

function getText(formData: FormData, field: string) {
  return String(formData.get(field) || '').trim()
}

async function uploadProductImage(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) return null
  if (!file.type.startsWith('image/')) throw new Error('The uploaded file must be an image')
  if (file.size > 5 * 1024 * 1024) throw new Error('Images must be 5MB or smaller')

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `products/${crypto.randomUUID()}.${extension}`
  const adminClient = getAdminClient()
  const { error: uploadError } = await adminClient.storage.from('product-images').upload(path, Buffer.from(await file.arrayBuffer()), {
    contentType: file.type,
    upsert: false,
  })
  if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`)
  return adminClient.storage.from('product-images').getPublicUrl(path).data.publicUrl
}

async function getProductValues(formData: FormData) {
  const name = getText(formData, 'name')
  const imageUrl = getText(formData, 'image_url')
  const currentImageUrl = getText(formData, 'current_image_url')
  const description = getText(formData, 'description')
  const price = Number(formData.get('price'))
  const categoryId = getText(formData, 'category_id')
  const variantsJson = getText(formData, 'variants_json')
  const imageFile = formData.get('image_file')

  if (!name || !Number.isFinite(price) || price < 0) {
    throw new Error('Name and a valid price are required')
  }

  let finalImageUrl = imageUrl || currentImageUrl
  const uploadedImageUrl = await uploadProductImage(imageFile)
  if (uploadedImageUrl) finalImageUrl = uploadedImageUrl

  if (!finalImageUrl) throw new Error('Choose an image file or provide an image URL')

  let variants: { color: string; image_url: string; in_stock: boolean }[] | undefined
  if (variantsJson) {
    try {
      const parsed = JSON.parse(variantsJson) as { color: string; image_url: string }[]
      variants = await Promise.all(parsed.map(async (variant, index) => ({
        ...variant,
        image_url: await uploadProductImage(formData.get(`variant_image_file_${index}`)) || getText(formData, `variant_image_url_${index}`) || variant.image_url,
        in_stock: formData.get(`variant_in_stock_${index}`) === 'on',
      })))
    } catch {
      throw new Error('Product variants are invalid')
    }
  } else {
    const submittedVariants = await Promise.all([0, 1, 2].map(async (index) => ({
      color: getText(formData, `variant_color_${index}`),
      image_url: await uploadProductImage(formData.get(`variant_image_file_${index}`)) || getText(formData, `variant_image_url_${index}`),
      in_stock: formData.get(`variant_in_stock_${index}`) === 'on',
    })))
    const hasVariantFields = submittedVariants.some((variant) => variant.color || variant.image_url)
    if (hasVariantFields) {
      if (submittedVariants.some((variant) => Boolean(variant.color) !== Boolean(variant.image_url))) {
        throw new Error('Each variant needs both a color and an image URL')
      }
      variants = submittedVariants.filter((variant) => variant.color && variant.image_url)
    }
  }

  return {
    name,
    image_url: finalImageUrl,
    description: description || null,
    price,
    category_id: categoryId || null,
    in_stock: formData.get('in_stock') === 'on',
    ...(variants ? { variants } : {}),
  }
}

export async function getAdminProducts() {
  await requireAdmin()
  const { data, error } = await getAdminClient().from('products').select('*').order('name').returns<{
    id: string
    name: string
    description: string | null
    price: number
    image_url: string
    category_id: string | null
    in_stock: boolean
    variants: { color: string; image_url: string; in_stock?: boolean }[] | null
  }[]>()

  return { products: data || [], error: error?.message || null }
}

export async function getAdminOrders() {
  await requireAdmin()
  const { data, error } = await getAdminClient()
    .from('orders')
    .select('id, customer_name, customer_phone, delivery_address, items, total, payment_method, status, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  return { orders: data || [], error: error?.message || null }
}

export async function createProduct(formData: FormData) {
  await requireAdmin()
  const { error } = await getAdminClient().from('products').insert(await getProductValues(formData))
  if (error) throw new Error(error.message)
  revalidatePath('/shop')
  revalidatePath('/admin')
  redirect('/admin')
}

export async function updateProduct(formData: FormData) {
  await requireAdmin()
  const productId = getText(formData, 'id')
  if (!productId) throw new Error('Product ID is required')

  const { error } = await getAdminClient().from('products').update(await getProductValues(formData)).eq('id', productId)
  if (error) throw new Error(error.message)
  revalidatePath('/shop')
  revalidatePath(`/shop/${productId}`)
  revalidatePath('/admin')
  redirect('/admin')
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin()
  const productId = getText(formData, 'id')
  if (!productId) throw new Error('Product ID is required')

  const { error } = await getAdminClient().from('products').delete().eq('id', productId)
  if (error) throw new Error(error.message)
  revalidatePath('/shop')
  revalidatePath(`/shop/${productId}`)
  revalidatePath('/admin')
  redirect('/admin')
}

export async function toggleProductStock(formData: FormData) {
  await requireAdmin()
  const productId = getText(formData, 'id')
  const inStock = formData.get('in_stock') === 'true'
  if (!productId) throw new Error('Product ID is required')

  const { error } = await getAdminClient().from('products').update({ in_stock: !inStock }).eq('id', productId)
  if (error) throw new Error(error.message)
  revalidatePath('/shop')
  revalidatePath(`/shop/${productId}`)
  revalidatePath('/admin')
  redirect('/admin')
}
