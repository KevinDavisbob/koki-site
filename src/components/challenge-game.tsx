"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const FLAGS = [
  "FLAG{source_code_is_not_a_secret}",
  "FLAG{console_is_your_friend}",
  "FLAG{headers_tell_stories}",
];

export function ChallengeGame() {
  const t = useTranslations("Challenge");
  const [found, setFound] = useState([false, false, false]);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [revealedHints, setRevealedHints] = useState([false, false, false]);

  // 第 2 关的 flag 会在控制台打印——这就是关卡本身
  useEffect(() => {
    console.log(
      "%c👀 你打开了控制台！送你一个 flag: " + FLAGS[1],
      "color:#6366f1;font-size:14px;font-weight:bold",
    );
  }, []);

  const foundCount = found.filter(Boolean).length;
  const allFound = foundCount === 3;

  function submit() {
    const value = input.trim();
    const index = FLAGS.indexOf(value);
    if (index === -1 || found[index]) {
      setFeedback("wrong");
      return;
    }
    setFound((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
    setInput("");
    setFeedback("correct");
  }

  const levelHints = [t("level1Hint"), t("level2Hint"), t("level3Hint")];
  const levelTitles = [t("level1Title"), t("level2Title"), t("level3Title")];

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        🎮 {t("title")}
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">{t("description")}</p>
      <p className="mt-4 inline-block rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
        {t("allFound", { n: foundCount })}
      </p>

      {/* 关卡 */}
      <ol className="mt-10 flex flex-col gap-4">
        {levelTitles.map((title, index) => (
          <li
            key={title}
            className={`rounded-xl border p-5 transition-colors ${
              found[index]
                ? "border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30"
                : "border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">
                <span className="mr-2 text-indigo-600 dark:text-indigo-400">
                  {t("level", { n: index + 1 })}
                </span>
                {title}
              </h2>
              {found[index] ? (
                <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  ✓ {t("solved")}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setRevealedHints((prev) => {
                      const next = [...prev];
                      next[index] = !next[index];
                      return next;
                    })
                  }
                  className="shrink-0 text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400"
                >
                  💡 {t("hint")}
                </button>
              )}
            </div>
            {revealedHints[index] && !found[index] && (
              <p className="mt-3 rounded-lg bg-zinc-100 px-4 py-3 text-sm leading-6 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                {levelHints[index]}
              </p>
            )}
          </li>
        ))}
      </ol>

      {/* 第一关的 flag 藏在 HTML 注释里——右键查看网页源代码找找看 */}
      <span
        aria-hidden
        dangerouslySetInnerHTML={{
          __html: "<!-- FLAG{source_code_is_not_a_secret} -->",
        }}
      />

      {/* 提交区 */}
      <div className="mt-8 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <label htmlFor="flag-input" className="text-sm font-medium">
          Flag
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="flag-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={t("flagPlaceholder")}
            className="w-full flex-1 rounded-lg border border-zinc-300 bg-transparent px-3 py-2 font-mono text-sm outline-none transition-colors focus:border-indigo-500 dark:border-zinc-700"
          />
          <button
            type="button"
            onClick={submit}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            {t("submit")}
          </button>
        </div>
        {feedback === "correct" && (
          <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            {t("correct")}
          </p>
        )}
        {feedback === "wrong" && (
          <p className="mt-3 text-sm font-medium text-rose-600 dark:text-rose-400">
            {t("wrong")}
          </p>
        )}
      </div>

      {/* 通关彩蛋 */}
      {allFound && (
        <div className="mt-8 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 p-6 text-center text-white">
          <p className="text-lg font-bold">{t("congrats")}</p>
          <p className="mt-2 font-mono text-sm opacity-90">
            → 下一步：picoCTF / BUUCTF 等你，见「安全专区」←
          </p>
        </div>
      )}
    </div>
  );
}
