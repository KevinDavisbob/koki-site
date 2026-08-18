import { getAllPosts } from "@/lib/posts";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function buildFeed(locale: Locale): Promise<string> {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const feedUrl = `${siteConfig.url}${prefix}/feed.xml`;

  // 摘要版 RSS：Next 16 禁止在路由处理器中用 react-dom/server 渲染 MDX 正文
  const posts = getAllPosts(locale);
  const items = posts.map((p) => {
    const link = `${siteConfig.url}${prefix}/blog/${p.slug}`;
    return `<item>
    <title>${escapeXml(p.title)}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
    <description>${escapeXml(p.description ?? "")}</description>
  </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description[locale])}</description>
    <language>${locale === "zh" ? "zh-cn" : "en-us"}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
${items.join("\n")}
  </channel>
</rss>`;
}
