import Link from 'next/link'
import Image from 'next/image'

export default function Page() {
  return (
    <main className="page">
      <section className="hero" aria-labelledby="brand-name">
        <div className="imageFrame">
          <Image
            src="https://znfnusaqdsgwrxvrueqf.supabase.co/storage/v1/object/public/product-images/herobag.jpg"
            alt="Sculptural burgundy leather handbag with gold hardware"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="copy">
          <h1 id="brand-name">ClareBags</h1>
          <p>Quietly considered bags for every chapter.</p>
          <Link href="/shop">Shop Now</Link>
        </div>
      </section>
      <style>{`
        :global(*) { box-sizing: border-box; }
        :global(html), :global(body) { margin: 0; min-height: 100%; background: #f7f1e7; }
        :global(body) { color: #2c1b1b; }
        .page {
          min-height: 100svh;
          background: #f7f1e7;
        }
        .hero {
          position: relative;
          height: 100svh;
          overflow: hidden;
        }
        .imageFrame {
          position: absolute;
          inset: 0;
        }
        .imageFrame img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        .imageFrame::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(20,10,10,0.55) 0%, rgba(20,10,10,0.15) 45%, transparent 70%);
        }
        .copy {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          height: 100%;
          padding: clamp(2rem, 6vw, 5rem);
          max-width: 32rem;
        }
        h1 {
          margin: 0;
          color: #f7f1e7;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(2.5rem, 5.5vw, 4.5rem);
          font-weight: 400;
          letter-spacing: -0.03em;
          line-height: 0.95;
        }
        p {
          max-width: 19rem;
          margin: 1.25rem 0 2rem;
          color: rgba(247, 241, 231, 0.85);
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(0.95rem, 1.2vw, 1.1rem);
          line-height: 1.45;
        }
        a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.9rem 1.5rem;
          border: 1px solid #f7f1e7;
          background: #6e1423;
          color: #f7f1e7;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 180ms ease, color 180ms ease;
        }
        a:hover, a:focus-visible { background: transparent; color: #f7f1e7; }
        a:focus-visible { outline: 2px solid #f7f1e7; outline-offset: 4px; }
        @media (max-width: 700px) {
          .copy {
            padding: 1.75rem;
            max-width: 100%;
            justify-content: flex-end;
            padding-bottom: 3.5rem;
          }
          h1 { font-size: clamp(2.1rem, 9vw, 2.75rem); }
          p { max-width: 17rem; }
          .imageFrame::after {
            background: linear-gradient(180deg, rgba(20,10,10,0.1) 0%, rgba(20,10,10,0.6) 100%);
          }
        }
        @media (prefers-reduced-motion: reduce) { a { transition: none; } }
      `}</style>
    </main>
  )
}