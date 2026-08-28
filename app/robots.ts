import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();

  // Preview deployments must never be indexed — they would compete with the apex for
  // the same content and split the signal.
  const isProduction = base.includes("duvaryne.com");

  if (!isProduction) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      // Named explicitly so the crawlers behind AI answers are unambiguously permitted.
      { userAgent: ["GPTBot", "PerplexityBot", "ClaudeBot", "Google-Extended"], allow: "/" },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: absoluteUrl("/").replace(/\/$/, ""),
  };
}
