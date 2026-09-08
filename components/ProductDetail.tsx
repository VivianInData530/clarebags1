'use client'

import { useState } from 'react'
import Image from 'next/image'
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
    if (!product.in_stock) return
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
        <Image
          key={displayImage}
          className="variantImage"
          src={displayImage}
          alt={`${product.name} leather handbag${selectedVariant ? ` in ${selectedVariant.color}` : ''}`}
          fill
          sizes="(max-width: 700px) 100vw, 55vw"
        />
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
          <button type="button" className="addToCartButton" disabled={!product.in_stock} onClick={handleAddToCart}>
            {product.in_stock ? 'Add to cart' : 'Sold out'}
          </button>
        </div>
      </div>
      <style>{`
        .variantImage { animation: variantImageFade 200ms ease-out both; }
        @keyframes variantImageFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .variantImage { animation: none; }
        }
      `}</style>
    </>
  )
}