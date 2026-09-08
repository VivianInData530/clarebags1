import Link from 'next/link'
import { getAdminOrders, isAdminAuthenticated, logoutAdmin } from '../actions'

export const dynamic = 'force-dynamic'

type OrderItem = {
  name: string
  qty: number
  price: number
  color?: string
}

export default async function AdminOrdersPage() {
  const isAuthenticated = await isAdminAuthenticated()

  if (!isAuthenticated) {
    return (
      <main className="ordersPage">
        <section className="messagePanel">
          <h1>Admin access required</h1>
          <Link href="/admin">Go to admin login</Link>
        </section>
        <OrdersStyles />
      </main>
    )
  }

  const { orders, error } = await getAdminOrders()

  return (
    <main className="ordersPage">
      <header className="ordersHeader">
        <div>
          <Link href="/admin" className="backLink">Back to products</Link>
          <p className="eyebrow">ClareBags</p>
          <h1>Recent orders</h1>
        </div>
        <form action={logoutAdmin}>
          <button type="submit" className="button outlined">Log out</button>
        </form>
      </header>

      {error ? (
        <p className="errorMessage">Could not load orders: {error}</p>
      ) : orders.length === 0 ? (
        <p className="emptyMessage">No orders yet.</p>
      ) : (
        <div className="orderList">
          {orders.map((order) => {
            const items = Array.isArray(order.items) ? order.items as OrderItem[] : []
            return (
              <details className="orderDetails" key={order.id}>
                <summary className="orderSummary">
                  <span>
                    <strong>{order.customer_name}</strong>
                    <small>{order.customer_phone}</small>
                  </span>
                  <span>{items.length} product{items.length === 1 ? '' : 's'}</span>
                  <span>₦{Number(order.total).toLocaleString()}</span>
                  <span className="summaryTags">
                    <span className="method">{order.payment_method}</span>
                    <span className={`status status-${order.status}`}>{order.status}</span>
                  </span>
                  <span>{order.created_at ? new Date(order.created_at).toLocaleString() : '—'}</span>
                  <span className="openLabel">View breakdown</span>
                </summary>
                <div className="orderBreakdown">
                  <div className="customerDetails">
                    <div><span>Customer</span><strong>{order.customer_name}</strong></div>
                    <div><span>Phone</span><strong>{order.customer_phone}</strong></div>
                    <div><span>Delivery address</span><strong>{order.delivery_address}</strong></div>
                  </div>
                  <h2>Order items</h2>
                  {items.length > 0 ? (
                    <div className="itemList">
                      {items.map((item, index) => {
                        const lineTotal = item.price * item.qty
                        return (
                          <div className="itemRow" key={`${item.name}-${item.color || 'default'}-${index}`}>
                            <div><strong>{item.name}</strong>{item.color && <small>{item.color}</small>}</div>
                            <span>{item.qty} × ₦{item.price.toLocaleString()}</span>
                            <strong>₦{lineTotal.toLocaleString()}</strong>
                          </div>
                        )
                      })}
                    </div>
                  ) : <p>No item details recorded.</p>}
                  <div className="orderTotal"><span>Order total</span><strong>₦{Number(order.total).toLocaleString()}</strong></div>
                </div>
              </details>
            )
          })}
        </div>
      )}
      <OrdersStyles />
    </main>
  )
}

function OrdersStyles() {
  return (
    <style>{`
      :global(*) { box-sizing: border-box; }
      :global(body) { margin: 0; background: #f7f1e7; color: #2c1b1b; }
      .ordersPage { min-height: 100svh; padding: clamp(1.5rem, 5vw, 5rem) clamp(1.25rem, 6vw, 7rem) 6rem; font-family: Arial, Helvetica, sans-serif; }
      .ordersHeader { display: flex; align-items: end; justify-content: space-between; gap: 1rem; max-width: 1400px; margin: 0 auto 4rem; }
      .backLink { display: inline-block; margin-bottom: 2rem; color: #6e1423; font-size: .65rem; letter-spacing: .1em; text-decoration: none; text-transform: uppercase; }
      .eyebrow { margin: 0 0 .75rem; color: #6e1423; font-size: .65rem; letter-spacing: .18em; text-transform: uppercase; }
      h1 { margin: 0; color: #6e1423; font: 400 clamp(2.5rem, 6vw, 5rem) Georgia, 'Times New Roman', serif; }
      .button { display: inline-flex; align-items: center; justify-content: center; min-height: 2.6rem; padding: .7rem 1rem; border: 1px solid #6e1423; background: transparent; color: #6e1423; font: 600 .65rem Arial, Helvetica, sans-serif; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; }
      .orderList { display: grid; gap: .75rem; max-width: 1400px; margin: 0 auto; }
      .orderDetails { border: 1px solid rgba(110, 20, 35, .2); background: rgba(255, 255, 255, .16); }
      .orderSummary { display: grid; grid-template-columns: 1.2fr .7fr .8fr 1.2fr 1.2fr auto; align-items: center; gap: 1rem; padding: 1rem; cursor: pointer; list-style: none; font-size: .78rem; }
      .orderSummary::-webkit-details-marker { display: none; }
      .orderSummary > span { min-width: 0; }
      .orderSummary strong, .orderSummary small { display: block; }
      .orderSummary strong { font-family: Georgia, 'Times New Roman', serif; font-size: 1rem; font-weight: 400; }
      .orderSummary small { margin-top: .25rem; color: #6e1423; font-size: .7rem; }
      .summaryTags { display: flex; flex-wrap: wrap; gap: .35rem; }
      .openLabel { color: #6e1423; font-size: .62rem; letter-spacing: .08em; text-align: right; text-transform: uppercase; }
      .orderBreakdown { padding: 1.5rem; border-top: 1px solid rgba(110, 20, 35, .15); }
      .customerDetails { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
      .customerDetails span { display: block; margin-bottom: .35rem; color: #6e1423; font-size: .62rem; letter-spacing: .1em; text-transform: uppercase; }
      .customerDetails strong { font-family: Georgia, 'Times New Roman', serif; font-weight: 400; line-height: 1.4; }
      .orderBreakdown h2 { margin-bottom: 1rem; font-size: 1.35rem; }
      .itemList { border-top: 1px solid rgba(110, 20, 35, .15); }
      .itemRow { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; gap: 1.5rem; padding: .85rem 0; border-bottom: 1px solid rgba(110, 20, 35, .1); font-size: .8rem; }
      .itemRow strong, .itemRow small { display: block; }
      .itemRow > div strong { font-family: Georgia, 'Times New Roman', serif; font-size: 1rem; font-weight: 400; }
      .itemRow small { margin-top: .25rem; color: #6e1423; font-size: .7rem; }
      .orderTotal { display: flex; justify-content: space-between; gap: 1rem; padding-top: 1rem; color: #6e1423; font-size: .75rem; letter-spacing: .1em; text-transform: uppercase; }
      .orderTotal strong { font-weight: 600; }
      .method, .status { display: inline-block; padding: .35rem .5rem; border: 1px solid rgba(110, 20, 35, .25); color: #6e1423; font-size: .65rem; text-transform: uppercase; }
      .status-paid { background: rgba(110, 20, 35, .12); }
      .status-pending { background: transparent; }
      .errorMessage { color: #9d1d2e; }
      .emptyMessage { max-width: 1400px; margin: 0 auto; font-family: Georgia, 'Times New Roman', serif; }
      .messagePanel { max-width: 28rem; margin: 20vh auto; }
      .messagePanel a { color: #6e1423; }
      @media (max-width: 800px) { .orderSummary { grid-template-columns: 1fr auto; } .orderSummary > span:nth-child(2), .orderSummary > span:nth-child(3), .orderSummary > span:nth-child(4), .orderSummary > span:nth-child(5) { display: none; } .openLabel { text-align: left; } .customerDetails { grid-template-columns: 1fr; } }
      @media (max-width: 700px) { .ordersHeader { align-items: start; flex-direction: column; } .itemRow { grid-template-columns: 1fr auto; gap: .5rem; } .itemRow > span { grid-column: 1; } .itemRow > strong { grid-column: 2; grid-row: 1 / span 2; align-self: center; } }
    `}</style>
  )
}
