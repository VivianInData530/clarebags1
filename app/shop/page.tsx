import { supabase } from '@/lib/supabaseClient'
import { Product } from '@/lib/types'
import ProductCard from '@/components/ProductCard'

export default async function ShopPage() {
 const { data: products, error } = await supabase
  .from('products')
  .select('*')
  .eq('in_stock', true)
  .returns<Product[]>()



  return (
    <main className="page">
      <header className="header">
        <h1>ClareBags</h1>
        <p>THE EVERYDAY EDIT</p>
      </header>
      <section className="productGrid" aria-label="ClareBags collection">
        {products?.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
      <style>{`
        :global(*) { box-sizing: border-box; }
        :global(html), :global(body) { margin: 0; min-height: 100%; background: #f7f1e7; }
        :global(body) { color: #2c1b1b; }
        .page { min-height: 100svh; padding: clamp(2rem, 5vw, 5.5rem) clamp(1.25rem, 6vw, 7rem) 7rem; background: #f7f1e7; }
        .header { display: flex; align-items: flex-end; justify-content: space-between; max-width: 1440px; margin: 0 auto clamp(3.5rem, 8vw, 8rem); }
        .header h1 { margin: 0; color: #6e1423; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2.4rem, 4.8vw, 5.2rem); font-weight: 400; letter-spacing: -.075em; line-height: .82; }
        .header p { margin: 0 0 .2rem; color: #6e1423; font-family: Arial, Helvetica, sans-serif; font-size: .62rem; letter-spacing: .22em; }
        .productGrid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(4rem, 8vw, 9rem) clamp(1.25rem, 3.8vw, 5rem); max-width: 1440px; margin: 0 auto; }
        @media (max-width: 900px) { .productGrid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        @media (max-width: 560px) { .page { padding: 1.75rem 1rem 4.5rem; } .header { align-items: baseline; margin-bottom: 3.5rem; } .header p { margin: 0; font-size: .53rem; letter-spacing: .16em; } .productGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3.75rem 1rem; } }
      `}</style>
    </main>
  )
}