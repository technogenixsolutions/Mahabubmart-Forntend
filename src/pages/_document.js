import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    return await Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Favicon */}
          <link rel="icon" href="/MahabubMart.png" />

          {/* ✅ PWA REQUIRED */}
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#ffffff" />
          <link rel="apple-touch-icon" href="/icons/icon-192.png" />

          {/* SEO */}
          <meta charSet="UTF-8" />
          <meta name="author" content="Mahabubmart" />
          <meta
            name="description"
            content="Mahabubmart is a trusted online shopping platform in Bangladesh offering electronics, gadgets, home appliances and daily essentials at affordable prices."
          />

          {/* Open Graph */}
          <meta property="og:title" content="Mahabubmart | Online Shopping for Electronics & Gadgets in Bangladesh" />
          <meta property="og:type" content="website" />
          <meta
            property="og:description"
            content="Shop electronics, gadgets, home appliances and daily essentials from Mahabubmart with great deals and fast delivery across Bangladesh."
          />
          <meta name="facebook-domain-verification" content="dn3vu0z11fx4xv08ky4uhy899h7cnf" />
          <meta property="og:url" content="https://www.mahabubmart.com/" />
          <meta property="og:image" content="https://www.mahabubmart.com/MahabubMart.png" />
          <meta property="og:site_name" content="Mahabubmart" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Mahabubmart Online Store" />
          <meta
            name="twitter:description"
            content="Buy electronics, gadgets and daily essentials online from Mahabubmart."
          />
          <meta name="twitter:image" content="https://www.mahabubmart.com/MahabubMart.png" />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;