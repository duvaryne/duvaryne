import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/**
 * `trailingSlash: true` because every canonical, sitemap entry and JSON-LD `url` in this
 * codebase is built by absoluteUrl(), which appends a slash. The two must agree or Google
 * sees a canonical that redirects.
 *
 * There are deliberately no legacy redirects here. duvaryne.com is a new domain with no
 * index history, and the predecessor site is not being redirected into it.
 */
const nextConfig: NextConfig = {
  /**
   * Required by the OpenNext Cloudflare adapter, which reads .next/standalone.
   * Set here rather than left to the adapter because `cf:build` drives `next build`
   * itself (with --webpack) instead of letting the adapter invoke it.
   */
  output: "standalone",

  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

// Makes Worker bindings and secrets available to `next dev`. No-op in production builds.
initOpenNextCloudflareForDev();
