import { buildFeed } from "@/lib/rss";
import { routing } from "@/i18n/routing";

// 中文订阅源（默认 locale 无前缀）
export async function GET() {
  const xml = await buildFeed(routing.defaultLocale);
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
