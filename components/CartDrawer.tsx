'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useCart } from '@/lib/CartContext'
import Image from 'next/image'

const CheckoutForm = dynamic(() => import('@/components/CheckoutForm'), { ssr: false })

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, removeItem, updateQty } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const closeDrawer = useCallback(() => {
    setIsCheckingOut(false)
    setIsConfirmed(false)
    setIsOpen(false)
  }, [setIsOpen])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeDrawer()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeDrawer])

  return (
    <>
      <div className={`drawerBackdrop${isOpen ? ' is-visible' : ''}`} onClick={closeDrawer} aria-hidden="true" />
      <aside className={`cartDrawer${isOpen ? ' is-open' : ''}`} aria-label="Shopping cart" aria-hidden={!isOpen}>
        <div className="drawerHeader">
          <h2>{isCheckingOut ? 'Checkout' : isConfirmed ? 'Thank you' : 'Your cart'}</h2>
          <button type="button" className="closeButton" aria-label="Close cart" onClick={closeDrawer}>
            ×
          </button>
        </div>

        {isConfirmed ? (
          <div className="confirmation">
            <p>Your payment was successful and your order has been received.</p>
            <button type="button" className="checkoutButton filled" onClick={closeDrawer}>Continue shopping</button>
          </div>
        ) : isCheckingOut ? (
          <CheckoutForm
            items={cart}
            total={subtotal}
            onCancel={() => setIsCheckingOut(false)}
            onComplete={() => {
              setIsCheckingOut(false)
              setIsConfirmed(true)
            }}
          />
        ) : cart.length === 0 ? (
          <p className="emptyMessage">Your cart is empty.</p>
        ) : (
          <>
            <div className="cartItems">
              {cart.map((item) => (
                <article className="cartItem" key={`${item.id}-${item.color || 'default'}`}>
                  <Image src={item.image_url} alt="" width={80} height={80} sizes="80px" />
                  <div className="itemDetails">
                    <div className="itemHeading">
                      <div>
                        <h3>{item.name}</h3>
                        {item.color && <p>{item.color}</p>}
                      </div>
                      <button type="button" className="removeButton" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.id)}>
                        ×
                      </button>
                    </div>
                    <p className="itemPrice">₦{(item.price * item.qty).toLocaleString()}</p>
                    <div className="quantityControls" aria-label={`Quantity for ${item.name}`}>
                      <button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQty(item.id, item.qty - 1)}>
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => updateQty(item.id, item.qty + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="drawerFooter">
              <div className="subtotal"><span>Subtotal</span><strong>₦{subtotal.toLocaleString()}</strong></div>
              <div className="checkoutButtons">
                <button type="button" className="checkoutButton filled" disabled={!cart.length} onClick={() => setIsCheckingOut(true)}>
                  Pay with Paystack
                </button>
                <button type="button" className="checkoutButton outlined" disabled={!cart.length} onClick={() => setIsCheckingOut(true)}>
                  Order via WhatsApp
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
      <style>{`
        .drawerBackdrop { position: fixed; inset: 0; z-index: 40; background: rgba(20, 10, 10, .42); opacity: 0; pointer-events: none; transition: opacity 220ms ease; }
        .drawerBackdrop.is-visible { opacity: 1; pointer-events: auto; }
        .cartDrawer { position: fixed; inset: 0 0 0 auto; z-index: 50; display: flex; flex-direction: column; width: min(100%, 28rem); padding: 1.5rem; background: #f7f1e7; border-left: 1px solid #6e1423; color: #2c1b1b; transform: translateX(100%); visibility: hidden; transition: transform 260ms ease, visibility 260ms ease; }
        .cartDrawer.is-open { transform: translateX(0); visibility: visible; }
        .drawerHeader { display: flex; align-items: center; justify-content: space-between; padding-bottom: 1.25rem; border-bottom: 1px solid rgba(110, 20, 35, .18); }
        .drawerHeader h2 { margin: 0; color: #6e1423; font-family: Georgia, 'Times New Roman', serif; font-size: 1.8rem; font-weight: 400; }
        .closeButton, .removeButton { border: 0; background: transparent; color: #6e1423; cursor: pointer; }
        .closeButton { font-size: 1.8rem; line-height: 1; }
        .emptyMessage { margin: 2rem 0; font-family: Georgia, 'Times New Roman', serif; }
        .confirmation { display: flex; flex-direction: column; gap: 1.25rem; padding-top: 2rem; font-family: Georgia, 'Times New Roman', serif; font-size: 1.1rem; line-height: 1.5; }
        .confirmation p { margin: 0; }
        .cartItems { flex: 1; overflow-y: auto; padding: 1.25rem 0; }
        .cartItem { display: flex; gap: .9rem; padding: 1rem 0; border-bottom: 1px solid rgba(110, 20, 35, .12); }
        .cartItem img { width: 5rem; height: 5rem; flex-shrink: 0; object-fit: cover; background: #e6dacb; }
        .itemDetails { flex: 1; min-width: 0; }
        .itemHeading { display: flex; justify-content: space-between; gap: .75rem; }
        .itemHeading h3, .itemHeading p, .itemPrice { margin: 0; }
        .itemHeading h3 { font-family: Georgia, 'Times New Roman', serif; font-size: 1rem; font-weight: 400; }
        .itemHeading p { margin-top: .25rem; color: #6e1423; font-family: Arial, Helvetica, sans-serif; font-size: .65rem; text-transform: uppercase; }
        .removeButton { flex-shrink: 0; padding: 0; font-size: 1.35rem; line-height: 1; }
        .itemPrice { margin-top: .65rem; color: #6e1423; font-family: Arial, Helvetica, sans-serif; font-size: .72rem; letter-spacing: .06em; }
        .quantityControls { display: inline-flex; align-items: center; gap: .75rem; margin-top: .75rem; border: 1px solid rgba(110, 20, 35, .35); }
        .quantityControls button { width: 1.8rem; height: 1.8rem; padding: 0; border: 0; background: transparent; color: #6e1423; cursor: pointer; }
        .quantityControls span { min-width: 1rem; text-align: center; font-family: Arial, Helvetica, sans-serif; font-size: .75rem; }
        .drawerFooter { padding-top: 1rem; border-top: 1px solid rgba(110, 20, 35, .18); }
        .subtotal { display: flex; justify-content: space-between; color: #6e1423; font-family: Arial, Helvetica, sans-serif; font-size: .75rem; letter-spacing: .1em; text-transform: uppercase; }
        .subtotal strong { font-weight: 600; }
        .checkoutButtons { display: grid; gap: .65rem; margin-top: 1.25rem; }
        .checkoutButton { width: 100%; padding: .9rem 1rem; border: 1px solid #6e1423; font-family: Arial, Helvetica, sans-serif; font-size: .65rem; font-weight: 600; letter-spacing: .09em; text-transform: uppercase; cursor: pointer; }
        .checkoutButton.filled { background: #6e1423; color: #f7f1e7; }
        .checkoutButton.outlined { background: transparent; color: #6e1423; }
        .checkoutButton:disabled { cursor: not-allowed; opacity: .45; }
        @media (prefers-reduced-motion: reduce) { .drawerBackdrop, .cartDrawer { transition: none; } }
      `}</style>
    </>
  )
}
