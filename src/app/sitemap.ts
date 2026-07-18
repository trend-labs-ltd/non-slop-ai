import type { MetadataRoute } from "next";
import { getAllBriefings } from "@/lib/briefings";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/news`, changeFrequency: "daily", priority: 0.8 },
    { url: `${site.url}/about`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const briefingRoutes: MetadataRoute.Sitemap = getAllBriefings().map(
    (briefing) => ({
      url: `${site.url}/news/${briefing.slug}`,
      lastModified: briefing.frontmatter.date,
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  return [...staticRoutes, ...briefingRoutes];
}
