// Next.js 16 中 middleware 更名为 proxy（签名相同），next-intl 的处理器可直接使用
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
