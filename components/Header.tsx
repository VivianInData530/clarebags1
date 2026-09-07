'use client'

import Link from 'next/link'
import { useCart } from '@/lib/CartContext'

export default function Header() {
  const { cart, setIsOpen } = useCart()
  const itemCount = cart.reduce((sum: number, item: { qty: number }) => sum + item.qty, 0)

  return (
    <header className="site-header">
      <Link href="/" className="site-logo">
        ClareBags
      </Link>

      <nav className="site-nav" aria-label="Main navigation">
        <Link href="/" className="home-link">
          Home
        </Link>
        <Link href="/shop">Products</Link>
        <a href="#footer">Contact</a>
      </nav>

      <button
        type="button"
        className="cart-button"
        aria-label="Open cart"
        onClick={() => setIsOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="21" r="1" />
          <circle cx="18" cy="21" r="1" />
        </svg>

        {itemCount > 0 && (
          <span className="cart-badge" aria-label={`${itemCount} items in cart`}>
            {itemCount}
          </span>
        )}
      </button>
    </header>
  )
}