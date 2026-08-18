import { buildFeed } from "@/lib/rss";

// 英文订阅源（/en/feed.xml）
export async function GET() {
  const xml = await buildFeed("en");
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
