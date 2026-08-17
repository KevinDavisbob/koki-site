"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// 教育演示：输入内容以「纯文本」方式展示，绝不真正执行注入的代码
export function XssLab() {
  const t = useTranslations("Security");
  const [input, setInput] = useState("");
  const [posted, setPosted] = useState<string | null>(null);
  const [xssed, setXssed] = useState(false);

  function submit() {
    setPosted(input);
    setXssed(/<\s*script/i.test(input) || /onerror\s*=/i.test(input));
  }

  return (
    <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
      <h3 className="font-semibold">💥 {t("xssTitle")}</h3>
      <p className="mt-1.5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {t("xssHint")}
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={2}
        placeholder={`<script>alert(document.cookie)</script>`}
        className="mt-4 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 font-mono text-sm outline-none transition-colors focus:border-indigo-500 dark:border-zinc-700"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={submit}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          {t("xssSubmit")}
        </button>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("xssPayloads")}</p>
        <button
          type="button"
          onClick={() => setInput("<script>alert(document.cookie)</script>")}
          className="rounded-full border border-rose-300 px-2.5 py-1 font-mono text-xs text-rose-600 transition-colors hover:border-rose-400 dark:border-rose-800 dark:text-rose-400"
        >
          {"<script>alert(1)</script>"}
        </button>
      </div>

      {posted !== null && (
        <div className="mt-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("xssRendered")}</p>
          <div className="mt-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-6 dark:border-zinc-800 dark:bg-zinc-950">
            {/* 纯文本渲染：输入永远只是文字 */}
            {posted || <span className="text-zinc-400">（空留言）</span>}
          </div>
          {xssed ? (
            <p className="mt-3 rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              {t("xssSuccess")}
            </p>
          ) : (
            <p className="mt-3 rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              {t("xssSafe")}
            </p>
          )}
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        {t("xssNote")}
      </p>
    </div>
  );
}
