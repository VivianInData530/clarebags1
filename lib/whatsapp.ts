import { CartItem } from '@/lib/types'

export function buildWhatsAppLink(
  cartItems: CartItem[],
  cartTotal: number,
  customerName: string,
  deliveryAddress: string
): string {
  const message = `New Order:\n${cartItems.map((item) => `${item.qty}x ${item.name} - ₦${item.price}`).join('\n')}\n\nTotal: ₦${cartTotal}\nName: ${customerName}\nAddress: ${deliveryAddress}`
  const vendorNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '234XXXXXXXXXX'

  return `https://wa.me/${vendorNumber}?text=${encodeURIComponent(message)}`
}
