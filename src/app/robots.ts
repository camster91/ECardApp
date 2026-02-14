import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/events/",
          "/api/",
          "/login",
          "/signup",
          "/forgot-password",
          "/callback",
          "/settings",
        ],
      },
    ],
    sitemap: "https://ecard.ashbi.ca/sitemap.xml",
  };
}
