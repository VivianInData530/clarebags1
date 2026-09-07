'use client'

import { FormEvent, useState } from 'react'
import { usePaystackPayment } from 'react-paystack'
import { useCart } from '@/lib/CartContext'
import { supabase } from '@/lib/supabaseClient'
import { CartItem } from '@/lib/types'
import { buildWhatsAppLink } from '@/lib/whatsapp'

type CheckoutFormProps = {
  items: CartItem[]
  total: number
  onCancel: () => void
  onComplete: () => void
}

export default function CheckoutForm({ items, total, onCancel, onComplete }: CheckoutFormProps) {
  const { clearCart } = useCart()
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const initializePayment = usePaystackPayment({
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    email: customerEmail,
    amount: Math.round(total * 100),
    currency: 'NGN',
  })

  function validateCustomerDetails() {
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setError('Name, phone number, and delivery location are required.')
      return false
    }

    return true
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSaving(false)

    if (!validateCustomerDetails()) return

    const name = customerName.trim()
    const phone = customerPhone.trim()
    const address = deliveryAddress.trim()
    const email = customerEmail.trim()

    initializePayment({
      onSuccess: async () => {
        setIsSaving(true)
        const { error: orderError } = await supabase.from('orders').insert({
          customer_name: name,
          customer_phone: phone,
          delivery_address: address,
          items,
          total,
          payment_method: 'paystack',
          status: 'paid',
        })

        if (orderError) {
          setError('Payment succeeded, but we could not save your order. Please contact us with your payment reference.')
          setIsSaving(false)
          return
        }

        clearCart()
        setIsSaving(false)
        onComplete()
      },
      onClose: () => setIsSaving(false),
      config: {
         reference: `clarebags-${Date.now()}`,
         email,
         amount: Math.round(total * 100),
         currency: 'NGN',
      },
    })
  }

  async function handleWhatsAppOrder() {
    setError('')
    if (!validateCustomerDetails()) return

    setIsSaving(true)
    const name = customerName.trim()
    const phone = customerPhone.trim()
    const address = deliveryAddress.trim()

    const { error: orderError } = await supabase.from('orders').insert({
      customer_name: name,
      customer_phone: phone,
      delivery_address: address,
      items,
      total,
      payment_method: 'whatsapp',
      status: 'pending',
    })

    if (orderError) {
      setError('We could not save your order. Please try again.')
      setIsSaving(false)
      return
    }

    window.open(buildWhatsAppLink(items, total, name, address), '_blank', 'noopener,noreferrer')
    clearCart()
    setIsSaving(false)
    onComplete()
  }

  return (
    <form className="checkoutForm" onSubmit={handleSubmit}>
      <div className="checkoutTitle">
        <button type="button" className="backButton" onClick={onCancel} aria-label="Back to cart">←</button>
        <h2>Checkout</h2>
      </div>
      <p className="checkoutSummary">Pay ₦{total.toLocaleString()} securely with Paystack.</p>

      <label>
        Full name
        <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} required autoComplete="name" />
      </label>
      <label>
        Phone number
        <input type="tel" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} required autoComplete="tel" />
      </label>
      <label>
        Email address
        <input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} required autoComplete="email" />
      </label>
      <label>
        Delivery location / address
        <textarea value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} required rows={3} autoComplete="street-address" />
      </label>

      {error && <p className="checkoutError" role="alert">{error}</p>}
      <button type="submit" className="payButton" disabled={isSaving}>
        {isSaving ? 'Saving order...' : 'Continue to Paystack'}
      </button>
      <button type="button" className="whatsappButton" disabled={isSaving} onClick={handleWhatsAppOrder}>
        Order via WhatsApp
      </button>
      <style>{`
        .checkoutForm { display: flex; flex-direction: column; gap: 1rem; overflow-y: auto; padding-top: 1.25rem; }
        .checkoutTitle { display: flex; align-items: center; gap: .75rem; }
        .checkoutTitle h2 { margin: 0; color: #6e1423; font-family: Georgia, 'Times New Roman', serif; font-size: 1.8rem; font-weight: 400; }
        .backButton { padding: 0; border: 0; background: transparent; color: #6e1423; font-size: 1.4rem; cursor: pointer; }
        .checkoutSummary { margin: 0 0 .5rem; font-family: Georgia, 'Times New Roman', serif; line-height: 1.4; }
        .checkoutForm label { display: flex; flex-direction: column; gap: .4rem; color: #6e1423; font-family: Arial, Helvetica, sans-serif; font-size: .65rem; letter-spacing: .1em; text-transform: uppercase; }
        .checkoutForm input, .checkoutForm textarea { width: 100%; padding: .75rem; border: 1px solid rgba(110, 20, 35, .35); border-radius: 0; background: transparent; color: #2c1b1b; font: 1rem Georgia, 'Times New Roman', serif; letter-spacing: 0; text-transform: none; }
        .checkoutForm textarea { resize: vertical; }
        .checkoutForm input:focus, .checkoutForm textarea:focus { outline: 2px solid rgba(110, 20, 35, .35); outline-offset: 2px; }
        .checkoutError { margin: 0; color: #9d1d2e; font-family: Arial, Helvetica, sans-serif; font-size: .75rem; line-height: 1.4; }
        .payButton { margin-top: .5rem; padding: .95rem 1rem; border: 1px solid #6e1423; background: #6e1423; color: #f7f1e7; font-family: Arial, Helvetica, sans-serif; font-size: .68rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; }
        .whatsappButton { padding: .95rem 1rem; border: 1px solid #6e1423; background: transparent; color: #6e1423; font-family: Arial, Helvetica, sans-serif; font-size: .68rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; }
        .payButton:disabled { cursor: wait; opacity: .6; }
        .whatsappButton:disabled { cursor: wait; opacity: .6; }
      `}</style>
    </form>
  )
}
