"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";

export type SearchablePost = {
  slug: string;
  title: string;
  description?: string;
  tags?: string[];
};

/** 站内搜索弹窗：header 搜索按钮或 Cmd/Ctrl+K 打开，纯前端匹配当前语言的文章 */
export function SearchDialog({ posts }: { posts: SearchablePost[] }) {
  const t = useTranslations("Search");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // header 搜索按钮派发 open-search 事件；另支持 Cmd/Ctrl+K
  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("open-search", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("open-search", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // 打开时重置搜索词与高亮项（渲染期调整模式，避免 effect 内 setState）
  const [prevOpen, setPrevOpen] = useState(false);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setIndex(0);
    }
  }

  // 打开时聚焦并锁定背景滚动
  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => inputRef.current?.focus());
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // 简单打分：标题命中 > 标签命中 > 描述命中
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return posts
      .map((p) => {
        let score = 0;
        if (p.title.toLowerCase().includes(q)) score += 5;
        if ((p.tags ?? []).some((tag) => tag.toLowerCase().includes(q)))
          score += 3;
        if ((p.description ?? "").toLowerCase().includes(q)) score += 2;
        return { post: p, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((r) => r.post);
  }, [posts, query]);

  if (!open) return null;

  const go = (slug: string) => {
    setOpen(false);
    router.push(`/blog/${slug}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[index]) {
      e.preventDefault();
      go(results[index].slug);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center bg-black/40 p-4 pt-[15vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label={t("label")}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800">
          <svg
            className="h-4 w-4 shrink-0 text-zinc-400"
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
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder={t("placeholder")}
            className="h-12 w-full bg-transparent text-sm focus:outline-none"
          />
          <kbd className="shrink-0 rounded border border-zinc-200 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 dark:border-zinc-700">
            Esc
          </kbd>
        </div>

        {results.length > 0 ? (
          <ul className="max-h-80 overflow-y-auto p-2">
            {results.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 ${
                    i === index
                      ? "bg-zinc-100 dark:bg-zinc-900"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                  }`}
                >
                  <span className="block text-sm font-medium">{p.title}</span>
                  <span className="mt-0.5 block truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {p.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : query.trim() ? (
          <p className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            {t("noResults")}
          </p>
        ) : null}

        <div className="border-t border-zinc-200 px-4 py-2 text-[11px] text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
          {t("hint")}
        </div>
      </div>
    </div>
  );
}
