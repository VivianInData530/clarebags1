'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { CartItem } from '@/lib/types'

interface CartContextType {
  cart: CartItem[]
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  addToCart: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQty: (itemId: string, qty: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
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
    setIsOpen(true)
  }

  function removeItem(itemId: string) {
    persist(cart.filter(item => item.id !== itemId))
  }

  function updateQty(itemId: string, qty: number) {
    persist(cart.map(item => item.id === itemId ? { ...item, qty: Math.max(1, qty) } : item))
  }

  return (
    <CartContext.Provider value={{ cart, isOpen, setIsOpen, addToCart, removeItem, updateQty }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside a CartProvider')
  return context
}