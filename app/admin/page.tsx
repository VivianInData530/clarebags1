import { Product } from '@/lib/types'
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  loginAdmin,
  logoutAdmin,
  isAdminAuthenticated,
  toggleProductStock,
  updateProduct,
} from './actions'

export const dynamic = 'force-dynamic'

type AdminPageProps = {
  searchParams: Promise<{ error?: string }>
}

function ProductForm({ product }: { product?: Product }) {
  const action = product ? updateProduct : createProduct

  return (
    <form action={action} className="productForm" encType="multipart/form-data">
      {product && <input type="hidden" name="id" value={product.id} />}
      {product && <input type="hidden" name="current_image_url" value={product.image_url} />}
      <label>
        Name
        <input name="name" defaultValue={product?.name} required />
      </label>
      <label>
        Price (₦)
        <input name="price" type="number" min="0" step="1" defaultValue={product?.price} required />
      </label>
      <label className="wideField">
        Upload image from device
        <input name="image_file" type="file" accept="image/*" />
      </label>
      <label className="wideField">
        Or paste image URL
        <input name="image_url" type="url" defaultValue={product ? product.image_url : ''} />
      </label>
      <label>
        Category ID
        <input name="category_id" defaultValue={product?.category_id || ''} />
      </label>
      <label className="wideField">
        Description
        <textarea name="description" defaultValue={product?.description || ''} rows={3} />
      </label>
      <label className="checkboxLabel">
        <input name="in_stock" type="checkbox" defaultChecked={product?.in_stock ?? true} />
        In stock
      </label>
      {product?.variants && product.variants.length > 0 && (
        <fieldset className="variantInventory">
          <legend>Color inventory</legend>
          <input type="hidden" name="variants_json" value={JSON.stringify(product.variants)} />
          {product.variants.map((variant, index) => (
            <div className="variantFields" key={variant.color}>
              <label>
                {variant.color} image URL
                <input name={`variant_image_url_${index}`} type="url" defaultValue={variant.image_url} />
              </label>
              <label>
                Or choose {variant.color} image
                <input name={`variant_image_file_${index}`} type="file" accept="image/*" />
              </label>
              <label className="checkboxLabel">
                <input
                  name={`variant_in_stock_${index}`}
                  type="checkbox"
                  defaultChecked={variant.in_stock !== false}
                />
                {variant.color} in stock
              </label>
            </div>
          ))}
        </fieldset>
      )}
      {!product && (
        <fieldset className="variantInventory">
          <legend>Color variants (optional)</legend>
          <p className="fieldHint">Add up to three colors. Each color needs an image URL.</p>
          {[0, 1, 2].map((index) => (
            <div className="variantFields" key={index}>
              <label>
                Color {index + 1}
                <input name={`variant_color_${index}`} placeholder="e.g. Burgundy" />
              </label>
              <label>
                Image URL {index + 1}
                <input name={`variant_image_url_${index}`} type="url" placeholder="https://..." />
              </label>
              <label>
                Or choose image {index + 1}
                <input name={`variant_image_file_${index}`} type="file" accept="image/*" />
              </label>
              <label className="checkboxLabel">
                <input name={`variant_in_stock_${index}`} type="checkbox" defaultChecked />
                In stock
              </label>
            </div>
          ))}
        </fieldset>
      )}
      <button type="submit" className="button filled">{product ? 'Save changes' : 'Add product'}</button>
    </form>
  )
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const isAuthenticated = await isAdminAuthenticated()
  const params = await searchParams

  if (!isAuthenticated) {
    return (
      <main className="adminPage gatePage">
        <section className="gatePanel">
          <p className="eyebrow">ClareBags</p>
          <h1>Admin panel</h1>
          <p className="intro">Sign in to manage the collection.</p>
          <form action={loginAdmin} className="loginForm">
            <label>
              Password
              <input name="password" type="password" autoComplete="current-password" required autoFocus />
            </label>
            {params.error === 'invalid-password' && <p className="errorMessage">Incorrect password.</p>}
            {!process.env.ADMIN_PASSWORD && <p className="errorMessage">ADMIN_PASSWORD is not configured.</p>}
            <button type="submit" className="button filled">Unlock panel</button>
          </form>
        </section>
        <AdminStyles />
      </main>
    )
  }

  const { products, error } = await getAdminProducts()

  return (
    <main className="adminPage">
      <header className="adminHeader">
        <div>
          <p className="eyebrow">ClareBags</p>
          <h1>Products</h1>
        </div>
        <div className="headerActions">
          <a href="/admin/orders" className="button outlined">View orders</a>
          <form action={logoutAdmin}>
            <button type="submit" className="button outlined">Log out</button>
          </form>
        </div>
      </header>

      <section className="adminSection">
        <div className="sectionHeading">
          <div>
            <p className="sectionEyebrow">Manage inventory</p>
            <h2>Existing products</h2>
          </div>
          <span>{products.length} products</span>
        </div>
        {error ? <p className="errorMessage">Could not load products: {error}</p> : null}
        {products.length === 0 && !error ? <p className="emptyMessage">No products have been added yet.</p> : null}
        <div className="productList" aria-label="Existing products">
          {products.map((product) => (
            <article className="productRow" key={product.id}>
              <img src={product.image_url} alt="" />
              <div className="productSummary">
                <h3>{product.name}</h3>
                <p>₦{product.price.toLocaleString()} · {product.in_stock ? 'In stock' : 'Out of stock'}</p>
                {product.variants && product.variants.length > 0 && (
                  <ul className="variantSummary" aria-label="Product color inventory">
                    {product.variants.map((variant) => (
                      <li key={variant.color}>{variant.color}: {variant.in_stock === false ? 'Sold out' : 'In stock'}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rowActions">
                <details>
                  <summary className="button outlined">Edit</summary>
                  <ProductForm product={product} />
                </details>
                <form action={toggleProductStock}>
                  <input type="hidden" name="id" value={product.id} />
                  <input type="hidden" name="in_stock" value={String(product.in_stock)} />
                  <button type="submit" className="button outlined">{product.in_stock ? 'Mark out' : 'Mark in'}</button>
                </form>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={product.id} />
                  <button type="submit" className="button danger">Delete</button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="adminSection addSection">
        <p className="sectionEyebrow">New listing</p>
        <h2>Add product</h2>
        <ProductForm />
      </section>
      <AdminStyles />
    </main>
  )
}

function AdminStyles() {
  return (
    <style>{`
      :global(*) { box-sizing: border-box; }
      :global(body) { margin: 0; background: #f7f1e7; color: #2c1b1b; }
      .adminPage { min-height: 100svh; padding: clamp(1.5rem, 5vw, 5rem) clamp(1.25rem, 6vw, 7rem) 6rem; font-family: Arial, Helvetica, sans-serif; }
      .gatePage { display: grid; place-items: center; }
      .gatePanel { width: min(100%, 28rem); }
      .eyebrow { margin: 0 0 .75rem; color: #6e1423; font-size: .65rem; letter-spacing: .18em; text-transform: uppercase; }
      h1, h2, h3, p { margin-top: 0; }
      h1, h2, h3 { font-family: Georgia, 'Times New Roman', serif; font-weight: 400; }
      h1 { margin-bottom: 1rem; color: #6e1423; font-size: clamp(2.5rem, 6vw, 5rem); }
      h2 { margin-bottom: 1.25rem; color: #6e1423; font-size: 1.8rem; }
      h3 { margin-bottom: .4rem; font-size: 1.1rem; }
      .intro { margin-bottom: 2rem; font-family: Georgia, 'Times New Roman', serif; }
      .adminHeader, .sectionHeading { display: flex; align-items: end; justify-content: space-between; gap: 1rem; }
      .adminHeader { max-width: 1200px; margin: 0 auto 4rem; }
      .headerActions { display: flex; align-items: center; flex-wrap: wrap; gap: .5rem; }
      .adminSection { max-width: 1200px; margin: 0 auto 4rem; padding-top: 2rem; border-top: 1px solid rgba(110, 20, 35, .18); }
      .sectionEyebrow { margin: 0 0 .5rem; color: #6e1423; font-size: .62rem; letter-spacing: .14em; text-transform: uppercase; }
      .sectionHeading h2 { margin-bottom: .4rem; }
      .emptyMessage { font-family: Georgia, 'Times New Roman', serif; }
      .sectionHeading span { color: #6e1423; font-size: .7rem; letter-spacing: .1em; text-transform: uppercase; }
      .loginForm, .productForm { display: grid; gap: 1rem; }
      .productForm { grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 50rem; }
      .loginForm { max-width: 24rem; }
      label { display: grid; gap: .4rem; color: #6e1423; font-size: .65rem; letter-spacing: .1em; text-transform: uppercase; }
      input, textarea { width: 100%; padding: .75rem; border: 1px solid rgba(110, 20, 35, .35); border-radius: 0; background: transparent; color: #2c1b1b; font: 1rem Georgia, 'Times New Roman', serif; letter-spacing: 0; }
      textarea { resize: vertical; }
      input:focus, textarea:focus { outline: 2px solid rgba(110, 20, 35, .3); outline-offset: 2px; }
      .wideField { grid-column: 1 / -1; }
      .checkboxLabel { display: flex; grid-template-columns: auto 1fr; align-items: center; gap: .5rem; width: fit-content; }
      .checkboxLabel input { width: auto; }
      .variantInventory { display: grid; gap: .65rem; grid-column: 1 / -1; margin: 0; padding: 1rem; border: 1px solid rgba(110, 20, 35, .18); }
      .variantInventory legend { padding: 0 .35rem; color: #6e1423; font-size: .65rem; letter-spacing: .1em; text-transform: uppercase; }
      .variantFields { display: grid; gap: .75rem; padding: .75rem 0; border-bottom: 1px solid rgba(110, 20, 35, .1); }
      .variantFields:last-child { border-bottom: 0; }
      .fieldHint { margin: 0; color: #2c1b1b; font: .78rem Georgia, 'Times New Roman', serif; }
      .fieldHint { margin: 0; color: rgba(44, 27, 27, .7); font: .8rem Georgia, 'Times New Roman', serif; grid-column: 1 / -1; }
      .variantFields { display: grid; grid-template-columns: 1fr 1.5fr auto; align-items: end; gap: .75rem; padding-top: .5rem; }
      .variantSummary { display: flex; flex-wrap: wrap; gap: .35rem .8rem; margin: .5rem 0 0; padding: 0; color: #6e1423; font-size: .65rem; list-style: none; }
      .button { display: inline-flex; align-items: center; justify-content: center; min-height: 2.6rem; padding: .7rem 1rem; border: 1px solid #6e1423; border-radius: 0; font: 600 .65rem Arial, Helvetica, sans-serif; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; }
      .filled { background: #6e1423; color: #f7f1e7; }
      .outlined { background: transparent; color: #6e1423; }
      .danger { border-color: #9d1d2e; background: transparent; color: #9d1d2e; }
      .errorMessage { color: #9d1d2e; font-size: .78rem; line-height: 1.4; }
      .productList { display: grid; gap: .75rem; }
      .productRow { display: grid; grid-template-columns: 4.5rem minmax(0, 1fr) auto; align-items: center; gap: 1rem; padding: .85rem; border: 1px solid rgba(110, 20, 35, .14); }
      .productRow img { width: 4.5rem; height: 4.5rem; object-fit: cover; background: #e6dacb; }
      .productSummary p { margin: 0; color: #6e1423; font-size: .72rem; }
      .rowActions { display: flex; flex-wrap: wrap; justify-content: end; gap: .5rem; }
      details { position: relative; }
      details .productForm { position: absolute; right: 0; z-index: 2; width: min(80vw, 42rem); margin-top: .5rem; padding: 1rem; border: 1px solid rgba(110, 20, 35, .25); background: #f7f1e7; box-shadow: 0 1rem 2rem rgba(44, 27, 27, .12); }
      summary { list-style: none; }
      summary::-webkit-details-marker { display: none; }
      @media (max-width: 700px) { .adminHeader, .sectionHeading { align-items: start; flex-direction: column; } .productForm { grid-template-columns: 1fr; } .productRow { grid-template-columns: 3.5rem minmax(0, 1fr); } .productRow img { width: 3.5rem; height: 3.5rem; } .rowActions { grid-column: 1 / -1; justify-content: start; } details .productForm { right: auto; left: 0; width: min(90vw, 28rem); } .variantFields { grid-template-columns: 1fr; align-items: start; } }
    `}</style>
  )
}
