"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { siteConfig } from "@/lib/site";

type Item = { href: string; label: string; exact: boolean };
type GroupKey = "labs" | "learn";

const DIRECT: { href: "/" | "/blog" | "/projects" | "/about"; exact: boolean }[] =
  [
    { href: "/", exact: true },
    { href: "/blog", exact: false },
    { href: "/projects", exact: false },
    { href: "/about", exact: false },
  ];

export function Header() {
  const t = useTranslations("Nav");
  const tSearch = useTranslations("Search");
  const pathname = usePathname();
  const [open, setOpen] = useState<GroupKey | null>(null);
  const clusterRef = useRef<HTMLDivElement>(null);

  const groups: Record<GroupKey, Item[]> = {
    labs: [
      { href: "/security", label: t("security"), exact: false },
      { href: "/cars", label: t("cars"), exact: false },
      { href: "/physics", label: t("physics"), exact: false },
      { href: "/challenge", label: t("challenge"), exact: false },
    ],
    learn: [
      { href: "/roadmap", label: t("roadmap"), exact: false },
      { href: "/resources", label: t("resources"), exact: false },
      { href: "/books", label: t("books"), exact: false },
      { href: "/archive", label: t("archive"), exact: false },
      { href: "/friends", label: t("friends"), exact: false },
      { href: "/guestbook", label: t("guestbook"), exact: false },
    ],
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);
  const groupActive = (items: Item[]) =>
    items.some((i) => isActive(i.href, i.exact));

  // 关闭：点击外部 / Esc
  // 注意：不做 hover 展开——手机浏览器点击时会先模拟 mouseenter 再触发 click，
  // 两套逻辑会互相打架（先开再关，表现为点不开）。统一用点击切换。
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (clusterRef.current && !clusterRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // 路由变化时关闭下拉：用渲染期调整模式代替 effect（react-hooks 规则）
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(null);
  }

  const linkClass = (active: boolean) =>
    `shrink-0 rounded-md px-2 py-1.5 text-sm transition-colors sm:px-3 ${
      active
        ? "font-medium text-indigo-600 dark:text-indigo-400"
        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-background/80 backdrop-blur-md dark:border-zinc-800">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-2 px-6">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight hover:opacity-80"
        >
          {siteConfig.name}
          <span className="text-indigo-500">.</span>
        </Link>

        {/* 直接链接：窄屏横向滚动兜底（下拉面板不能放在此容器内，会被裁剪） */}
        <nav className="flex min-w-0 items-center gap-0.5 overflow-x-auto sm:gap-1">
          {DIRECT.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClass(isActive(item.href, item.exact))}
            >
              {t(item.href === "/" ? "home" : item.href.slice(1))}
            </Link>
          ))}
        </nav>

        <div
          ref={clusterRef}
          className="flex shrink-0 items-center gap-0.5 sm:gap-1"
        >
          {(Object.keys(groups) as GroupKey[]).map((key) => {
            const items = groups[key];
            const isOpen = open === key;
            return (
              <div key={key} className="relative">
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  aria-controls={`nav-panel-${key}`}
                  onClick={() => setOpen(isOpen ? null : key)}
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm transition-colors sm:px-3 ${
                    isOpen || groupActive(items)
                      ? "font-medium text-indigo-600 dark:text-indigo-400"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  }`}
                >
                  {t(key)}
                  <svg
                    className={`h-3 w-3 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {isOpen && (
                  <div
                    id={`nav-panel-${key}`}
                    className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-zinc-200 bg-white/95 p-1 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95"
                  >
                    {items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(null)}
                        className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                          isActive(item.href, item.exact)
                            ? "font-medium text-indigo-600 dark:text-indigo-400"
                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <button
            type="button"
            aria-label={tSearch("label")}
            onClick={() => window.dispatchEvent(new Event("open-search"))}
            className="rounded-md p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
