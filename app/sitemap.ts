import type { MetadataRoute } from "next";

/**
 * Date the page content last meaningfully changed. Bump this by hand when copy,
 * products, or structure change — not on every deploy. A lastmod that always
 * equals the build time is treated as untrustworthy and ignored by Google.
 * (changeFrequency and priority are omitted: Google ignores both.)
 */
const CONTENT_UPDATED = new Date("2026-11-14");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://scalar-ai.co",
      lastModified: CONTENT_UPDATED,
    },
  ];
}
