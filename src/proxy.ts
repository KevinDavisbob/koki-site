// Next.js 16 中 middleware 更名为 proxy（签名相同），next-intl 的处理器可直接使用
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const response = intlMiddleware(request);

  // CTF 挑战第 3 关：把 flag 藏在 /challenge 的响应头里
  const { pathname } = request.nextUrl;
  if (pathname === "/challenge" || pathname === "/en/challenge") {
    response.headers.set("X-Koki-Flag", "FLAG{headers_tell_stories}");
  }

  return response;
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
