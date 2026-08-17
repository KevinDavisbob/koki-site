import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["zh", "en"],
  defaultLocale: "zh",
  // 中文不带前缀（/），英文带前缀（/en/...）——更适合 .cn 域名
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

/** 把动态路由里的 string 窄化为 Locale，非法值返回 undefined */
export function toLocale(value: string): Locale | undefined {
  return (routing.locales as readonly string[]).includes(value)
    ? (value as Locale)
    : undefined;
}
