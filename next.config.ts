import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // next-mdx-remote 需要配合 Turbopack 转译（见其 README）
  transpilePackages: ["next-mdx-remote"],
};

// 让 next-intl 自动发现 src/i18n/request.ts
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
