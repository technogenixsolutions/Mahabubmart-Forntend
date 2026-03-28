const runtimeCaching = require("next-pwa/cache");
const nextTranslate = require("next-translate");

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  runtimeCaching,
  buildExcludes: [/middleware-manifest.json$/],
  scope: "/",
  sw: "service-worker.js",
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  reactStrictMode: true,

  // ✅ non-www → www redirect
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          { type: "host", value: "mahabubmart.com" },
        ],
        destination: "https://www.mahabubmart.com/:path*",
        permanent: true,
      },
    ];
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ শুধু আপনার actual locales রাখুন, example domains সরিয়ে দিলাম
  i18n: {
    locales: ["en-US", "es", "fr", "nl-NL"],
    defaultLocale: "en-US",
  },

  images: {
    domains: [
      "images.unsplash.com",
      "img.icons8.com",
      "i.ibb.co",
      "i.postimg.cc",
      "fakestoreapi.com",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "images.dashter.com",
    ],
  },

  ...nextTranslate(),
});