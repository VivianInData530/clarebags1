'use client'

import { useState } from 'react'
import { Product, Variant } from '@/lib/types'
import { useCart } from '@/lib/CartContext'

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
        </div>
      </div>
    </>
  )
}