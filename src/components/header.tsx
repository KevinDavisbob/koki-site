"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { siteConfig } from "@/lib/site";

type NavItem = {
  href: "/" | "/blog" | "/about";
  label: string;
  exact: boolean;
};

export function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  const nav: NavItem[] = [
    { href: "/", label: t("home"), exact: true },
    { href: "/blog", label: t("blog"), exact: false },
    { href: "/about", label: t("about"), exact: false },
  ];

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-background/80 backdrop-blur-md dark:border-zinc-800">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight hover:opacity-80"
        >
          {siteConfig.name}
          <span className="text-indigo-500">.</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                isActive(item)
                  ? "font-medium text-indigo-600 dark:text-indigo-400"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
