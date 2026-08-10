export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/cart", "/checkout", "/order-confirmation", "/membership/confirmation"],
      },
    ],
    sitemap: "https://www.ironvaultfitness.com/sitemap.xml",
  };
}
