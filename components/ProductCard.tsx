'use client'

import Link from 'next/link'
import { Product } from '@/lib/types'
import { useCart } from '@/lib/CartContext'

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  function handleAddToCart(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      image_url: product.image_url,
    })
  }

  return (
    <Link href={`/shop/${product.id}`} className="productCard">
      <article>
        <div className="imageWrap">
          <img src={product.image_url} alt={`${product.name} leather handbag`} />
          <button
            className="addButton"
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={handleAddToCart}
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>
        <div className="productInfo">
          <h2>{product.name}</h2>
          <p>₦{product.price.toLocaleString()}</p>
        </div>
      </article>
      <style>{`
        .productCard { min-width: 0; text-decoration: none; display: block; }
        .imageWrap { position: relative; aspect-ratio: 1; overflow: hidden; background: #e6dacb; }
        .imageWrap img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 500ms cubic-bezier(.2,.65,.25,1); }
        .productCard:hover .imageWrap img { transform: scale(1.035); }
        .addButton { position: absolute; right: .9rem; bottom: .9rem; display: grid; place-items: center; width: 2.45rem; height: 2.45rem; padding: 0; border: 0; border-radius: 50%; background: #6e1423; color: #f7f1e7; cursor: pointer; transition: background 180ms ease, transform 180ms ease; }
        .addButton span { font-family: Arial, Helvetica, sans-serif; font-size: 1.3rem; font-weight: 300; line-height: 1; transform: translateY(-1px); }
        .addButton:hover, .addButton:focus-visible { background: #50101b; transform: scale(1.06); }
        .addButton:focus-visible { outline: 2px solid #6e1423; outline-offset: 3px; }
        .productInfo { display: flex; align-items: baseline; justify-content: space-between; gap: .75rem; padding-top: 1.1rem; }
        .productInfo h2, .productInfo p { margin: 0; }
        .productInfo h2 { color: #2c1b1b; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(.9rem, 1.2vw, 1.08rem); font-weight: 400; letter-spacing: -.01em; }
        .productInfo p { color: #6e1423; font-family: Arial, Helvetica, sans-serif; font-size: .68rem; letter-spacing: .09em; white-space: nowrap; }
        @media (max-width: 560px) { .productInfo { display: block; padding-top: .8rem; } .productInfo p { margin-top: .38rem; } .addButton { right: .6rem; bottom: .6rem; width: 2.1rem; height: 2.1rem; } }
        @media (prefers-reduced-motion: reduce) { .imageWrap img { transition: none; } }
      `}</style>
    </Link>
  )
}