import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Product } from '@/lib/types'
import ProductDetail from '@/components/ProductDetail'
import ProductCard from '@/components/ProductCard'

type ProductPageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', slug)
    .maybeSingle<Product>()

  if (!product) {
    notFound()
  }

  const relatedQuery = supabase
    .from('products')
    .select('*')
    .neq('id', product.id)
    .limit(2)
    .returns<Product[]>()

  const { data: related } = product.category_id === null
    ? await relatedQuery.is('category_id', null)
    : await relatedQuery.eq('category_id', product.category_id)

  return (
    <main className="productPage">
      <Link href="/shop" className="backLink">
        Back to collection
      </Link>

      <section className="productDetail" aria-labelledby="product-name">
        <ProductDetail product={product} />
      </section>

      {related && related.length > 0 && (
        <section className="relatedSection" aria-label="You may also like">
          <p className="relatedHeading">You may also like</p>
          <div className="relatedGrid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      <style>{`
        :global(*) { box-sizing: border-box; }
        .productPage { min-height: 100svh; padding: clamp(1.5rem, 4vw, 4rem) clamp(1.25rem, 6vw, 7rem) 7rem; background: #f7f1e7; color: #2c1b1b; }
        .backLink { display: inline-block; margin-bottom: clamp(2rem, 5vw, 5rem); color: #6e1423; font-family: Arial, Helvetica, sans-serif; font-size: .68rem; letter-spacing: .12em; text-decoration: none; text-transform: uppercase; }
        .productDetail { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(18rem, .9fr); align-items: start; gap: clamp(2rem, 8vw, 9rem); max-width: 1200px; margin: 0 auto; }
        .productImage { position: relative; aspect-ratio: 1; overflow: hidden; background: #e6dacb; }
        .productImage img { display: block; width: 100%; aspect-ratio: 1; object-fit: cover; }
        .productCopy { padding-top: clamp(0rem, 4vw, 4rem); }
        .eyebrow, .price, .variants p { color: #6e1423; font-family: Arial, Helvetica, sans-serif; font-size: .66rem; letter-spacing: .14em; text-transform: uppercase; }
        .eyebrow { margin: 0 0 1rem; }
        h1 { margin: 0; color: #6e1423; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2.5rem, 5vw, 5rem); font-weight: 400; line-height: .95; }
        .price { margin: 1.5rem 0 0; }
        .description { max-width: 28rem; margin: 2rem 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: 1.08rem; line-height: 1.5; }
        .variants { margin-top: 3rem; }
        .variants p { margin: 0 0 .75rem; }
        .variantSwatch { display: inline-block; margin: 0 .5rem .5rem 0; padding: .5rem .7rem; border: 1px solid rgba(110, 20, 35, .3); background: transparent; font-family: Arial, Helvetica, sans-serif; font-size: .7rem; color: #2c1b1b; cursor: pointer; transition: border-color 150ms ease, background 150ms ease; }
        .variantSwatch:hover { border-color: #6e1423; }
        .variantSwatch.active { border-color: #6e1423; background: #6e1423; color: #f7f1e7; }
        .actionButtons { display: flex; flex-direction: column; gap: .75rem; margin-top: 2.5rem; max-width: 22rem; }
        .addToCartButton, .whatsappButton { padding: .95rem 1.5rem; font-family: Arial, Helvetica, sans-serif; font-size: .68rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; cursor: pointer; }
        .addToCartButton { border: 1px solid #6e1423; background: #6e1423; color: #f7f1e7; }
        .whatsappButton { border: 1px solid #6e1423; background: transparent; color: #6e1423; }
        .relatedSection { max-width: 1200px; margin: clamp(4rem, 10vw, 7rem) auto 0; padding-top: 3rem; border-top: 1px solid rgba(110, 20, 35, .14); }
        .relatedHeading { margin: 0 0 1.5rem; color: #6e1423; font-family: Arial, Helvetica, sans-serif; font-size: .66rem; letter-spacing: .18em; text-transform: uppercase; }
        .relatedGrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(2rem, 5vw, 3rem); max-width: 30rem; }
        @media (max-width: 700px) { .productDetail { grid-template-columns: 1fr; gap: 2.5rem; } .productCopy { padding-top: 0; } }
      `}</style>
    </main>
  )
}