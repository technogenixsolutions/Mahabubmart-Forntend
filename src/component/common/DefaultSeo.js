import React from "react";
import { DefaultSeo as NextSeo } from "next-seo";

const DefaultSeo = () => {
  return (
    <NextSeo
      title="Mahabubmart | Online Shopping for Electronics, Gadgets & Daily Essentials"
      description="Mahabubmart is a trusted online store in Bangladesh where you can shop electronics, gadgets, home appliances, fashion items and daily essentials at the best price."
      canonical="https://www.mahabubmart.com/"
      openGraph={{
        type: "website",
        locale: "en_BD",
        url: "https://www.mahabubmart.com/",
        site_name: "Mahabubmart",
        title:
          "Mahabubmart | Electronics, Gadgets & Online Shopping in Bangladesh",
        description:
          "Shop electronics, gadgets, home appliances and daily essentials online from Mahabubmart with fast delivery and affordable prices.",
        images: [
          {
            url: "https://www.mahabubmart.com/MahabubMart.png",
            width: 512,
            height: 512,
            alt: "Mahabubmart Online Store",
          },
        ],
      }}
      twitter={{
        handle: "@mahabubmart",
        site: "@mahabubmart",
        cardType: "summary_large_image",
      }}
      additionalMetaTags={[
        {
          name: "keywords",
          content:
            "Mahabubmart, online shopping Bangladesh, electronics store, gadgets shop, buy electronics online, best online shop BD",
        },
        {
          name: "viewport",
          content:
            "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
        },
        {
          name: "apple-mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "theme-color",
          content: "#ffffff",
        },
      ]}
      additionalLinkTags={[
        {
          rel: "apple-touch-icon",
          href: "/MahabubMart.png",
        },
        {
          rel: "manifest",
          href: "/manifest.json",
        },
      ]}
    />
  );
};

export default DefaultSeo;