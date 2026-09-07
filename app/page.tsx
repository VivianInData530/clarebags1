import Link from 'next/link'
import Header from '@/components/Header'

export default function Page() {
  return (
    <>
      <Header />

      <main className="page">
        <section className="hero" aria-labelledby="brand-name">
          <div className="imageFrame">
            <img
              src="/clarebags-editorial.png"
              alt="Editorial ClareBags handbag"
            />
          </div>

          <div className="copy">
            <p className="eyebrow">ClareBags</p>
            <h1 id="brand-name">Quietly considered bags for every chapter.</h1>

            <Link href="/shop" className="cta">
              Shop Now
            </Link>
          </div>
        </section>
      </main>

      <style>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html),
        :global(body) {
          margin: 0;
          background: #f7f1e7;
        }

        .page {
          min-height: calc(100svh - 76px);
          background: #f7f1e7;
        }

        .hero {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: calc(100svh - 76px);
          overflow: hidden;
        }

        .imageFrame {
          min-height: 520px;
        }

        .imageFrame img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(2rem, 8vw, 7rem);
          color: #2c1b1b;
        }

        .eyebrow {
          margin: 0 0 1.5rem;
          color: #6e1423;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        h1 {
          max-width: 27rem;
          margin: 0;
          color: #6e1423;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(2.5rem, 5vw, 5.5rem);
          font-weight: 400;
          letter-spacing: -0.04em;
          line-height: 0.98;
        }

        .cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: fit-content;
          margin-top: 2.5rem;
          padding: 1rem 1.6rem;
          color: #f7f1e7;
          background: #6e1423;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-decoration: none;
          text-transform: uppercase;
        }

        .cta:hover {
          background: #51101b;
        }

        @media (max-width: 700px) {
          .hero {
            grid-template-columns: 1fr;
            min-height: calc(100svh - 64px);
          }

          .imageFrame {
            min-height: 52svh;
          }

          .copy {
            min-height: 42svh;
            padding: 2.5rem 1.5rem 3rem;
          }

          h1 {
            max-width: 22rem;
            font-size: clamp(2.4rem, 11vw, 4rem);
          }

          .cta {
            margin-top: 2rem;
          }
        }
      `}</style>
    </>
  )
}