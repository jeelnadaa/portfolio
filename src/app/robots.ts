import { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url || "https://solarquack.in";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
