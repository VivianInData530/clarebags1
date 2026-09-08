'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import { CartItem } from '@/lib/types'

const CART_INTRO_SEEN_KEY = 'clarebags_cart_intro_seen'

interface CartContextType {
  cart: CartItem[]
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  addToCart: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQty: (itemId: string, qty: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const hasSeenCartIntro = useRef(false)

  useEffect(() => {
    hasSeenCartIntro.current = localStorage.getItem(CART_INTRO_SEEN_KEY) === 'true'

    const saved = localStorage.getItem('clarebags_cart')
    if (!saved) return

    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) queueMicrotask(() => setCart(parsed))
    } catch {
      localStorage.removeItem('clarebags_cart')
    }
  }, [])

  function persist(updated: CartItem[]) {
    setCart(updated)
    localStorage.setItem('clarebags_cart', JSON.stringify(updated))
  }

  function addToCart(item: CartItem) {
    const existing = cart.find(i => i.id === item.id && i.color === item.color)
    const updated = existing
      ? cart.map(i => i === existing ? { ...i, qty: i.qty + 1 } : i)
      : [...cart, { ...item, qty: 1 }]
    persist(updated)

    if (!hasSeenCartIntro.current) {
      hasSeenCartIntro.current = true
      localStorage.setItem(CART_INTRO_SEEN_KEY, 'true')
      setIsOpen(true)
    }
  }

  function removeItem(itemId: string) {
    persist(cart.filter(item => item.id !== itemId))
  }

  function updateQty(itemId: string, qty: number) {
    persist(cart.map(item => item.id === itemId ? { ...item, qty: Math.max(1, qty) } : item))
  }

  function clearCart() {
    setCart([])
    localStorage.removeItem('clarebags_cart')
  }

  return (
    <CartContext.Provider value={{ cart, isOpen, setIsOpen, addToCart, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside a CartProvider')
  return context
}