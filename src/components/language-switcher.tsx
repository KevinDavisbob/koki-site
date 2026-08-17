"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const nextLocale = locale === "zh" ? "en" : "zh";

  function switchLocale() {
    // 保留查询参数（如 ?tag=）
    const query =
      typeof window !== "undefined" ? window.location.search : "";
    router.replace(`${pathname}${query}`, { locale: nextLocale });
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      className="inline-flex h-9 items-center justify-center rounded-md px-2.5 text-xs font-semibold uppercase tracking-wide text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
    >
      {locale === "zh" ? "EN" : "中文"}
    </button>
  );
}
