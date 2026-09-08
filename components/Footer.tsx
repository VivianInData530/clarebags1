export default function Footer() {
  return (
    <footer id="footer" className="site-footer">
      <span className="footerBrand">ClareBags</span>

      <div className="footerLinks">
        <a
          href="https://instagram.com/yourhandle"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" className="iconFill" />
          </svg>
        </a>

        <a
          href="https://wa.me/234XXXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z" />
            <path d="M8.5 8.5c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.5.6c.6 1.1 1.5 2 2.6 2.6l.6-.5c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.4.2-1.2.3-2.2-.1-1-.4-2.1-1-3.1-2-1-.9-1.6-2-2-3.1-.4-1-.3-1.8-.1-2.2Z" />
          </svg>
        </a>
      </div>
    </footer>
  )
}