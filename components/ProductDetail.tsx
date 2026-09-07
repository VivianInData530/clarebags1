'use client'

import { useState } from 'react'
import { Product, Variant } from '@/lib/types'
import { useCart } from '@/lib/CartContext'

function buildWhatsAppLink(
  items: Array<{ name: string; price: number; qty: number; color?: string }>,
  total: number,
  customerName: string,
  address: string
) {
  const orderLines = items.map(
    (item) =>
      `${item.name}${item.color ? ` (${item.color})` : ''} x${item.qty} - ₦${item.price.toLocaleString()}`
  )
  const message = [
    'Hello, I would like to place an order from ClareBags.',
    `Customer: ${customerName}`,
    ...orderLines,
    `Total: ₦${total.toLocaleString()}`,
    address ? `Address: ${address}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const hasVariants = product.variants && product.variants.length > 0
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    hasVariants ? product.variants![0] : null
  )

  const displayImage = selectedVariant?.image_url || product.image_url

  function handleAddToCart() {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      color: selectedVariant?.color,
      image_url: displayImage,
    })
  }

  function handleWhatsAppOrder() {
    const link = buildWhatsAppLink(
      [{ name: product.name, price: product.price, qty: 1, color: selectedVariant?.color }],
      product.price,
      'WhatsApp customer', // quick single-item order — no name/address form here, the vendor collects those in chat
      ''
    )
    window.open(link, '_blank')
  }

  return (
    <>
      <div className="productImage">
        <img src={displayImage} alt={`${product.name} leather handbag${selectedVariant ? ` in ${selectedVariant.color}` : ''}`} />
      </div>

      <div className="productCopy">
        <p className="eyebrow">ClareBags collection</p>
        <h1>{product.name}</h1>
        <p className="price">₦{product.price.toLocaleString()}</p>
        {product.description && <p className="description">{product.description}</p>}

        {hasVariants && (
          <div className="variants" aria-label="Available colors">
            <p>Available colors</p>
            <div>
              {product.variants!.map((variant) => (
                <button
                  key={variant.color}
                  type="button"
                  className={`variantSwatch${selectedVariant?.color === variant.color ? ' active' : ''}`}
                  onClick={() => setSelectedVariant(variant)}
                >
                  {variant.color}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="actionButtons">
          <button type="button" className="addToCartButton" onClick={handleAddToCart}>
            Add to cart
          </button>
          <button type="button" className="whatsappButton" onClick={handleWhatsAppOrder}>
            Order via WhatsApp
          </button>
        </div>
      </div>
    </>
  )
}