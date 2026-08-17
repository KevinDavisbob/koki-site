import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const staticPaths = [
    "",
    "/blog",
    "/projects",
    "/security",
    "/challenge",
    "/cars",
    "/roadmap",
    "/resources",
    "/books",
    "/archive",
    "/about",
  ];

  for (const locale of routing.locales) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;

    for (const path of staticPaths) {
      entries.push({
        url: `${siteConfig.url}${prefix}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }

    for (const post of getAllPosts(locale)) {
      entries.push({
        url: `${siteConfig.url}${prefix}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "yearly",
        priority: 0.64,
      });
    }
  }

  return entries;
}
