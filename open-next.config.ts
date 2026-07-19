import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Read-only, Workers-Static-Assets-backed incremental cache. Required even
// though the site has no ISR/revalidateTag usage: Next's App Router routes
// ANY generateStaticParams-produced page (e.g. /news/[slug]) through the
// full route cache internally, and without an incremental cache configured
// at all, OpenNext's Cloudflare adapter has nowhere to resolve that
// prerendered HTML from at runtime — confirmed by testing (every SSG
// dynamic-segment page 404'd until this was added; plain static routes
// like / and /news were unaffected). No R2/KV needed since there's no
// revalidation to support — see https://opennext.js.org/cloudflare/caching.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
