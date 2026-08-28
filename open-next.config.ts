import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * OpenNext adapter config.
 *
 * `incrementalCache` is not optional in practice. Without it every statically generated
 * dynamic route — /products/, /about/, /case-studies/<slug>/, /blog/<slug>/ — resolves to
 * a 404 with `NoFallbackError`, because the router has nowhere to read the prerendered
 * page from. Plain static routes keep working, which makes the failure look like a
 * routing bug rather than a missing cache.
 *
 * The static-assets implementation serves those prerendered pages straight from the
 * Workers Assets binding already in wrangler.jsonc, so it needs no R2 bucket or KV
 * namespace and stays inside the free tier. The trade-off is that the cache is immutable
 * per deploy: on-demand revalidation is not available. This site rebuilds on push, so
 * that costs nothing.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
