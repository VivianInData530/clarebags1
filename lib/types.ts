export interface Variant {
  color: string
  image_url: string
  in_stock?: boolean
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string
  category_id: string | null
  in_stock: boolean
  variants: Variant[] | null
}

export interface CartItem {
  id: string
  name: string
  price: number
  qty: number
  color?: string
  image_url: string
}

export interface Order {
  id: string
  customer_name: string
  customer_phone: string
  delivery_address: string
  items: CartItem[]
  total: number
  payment_method: 'paystack' | 'whatsapp'
  status: string
}