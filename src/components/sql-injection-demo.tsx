"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// 教育演示：登录逻辑纯前端模拟，不会连接任何数据库
export function SqlInjectionDemo() {
  const t = useTranslations("Security");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<"fail" | "success" | null>(null);
  const [attempted, setAttempted] = useState<{ u: string; p: string } | null>(null);

  function login() {
    setAttempted({ u: username, p: password });
    // 模拟脆弱后端：输入直接拼接进 SQL
    // 注入检测：用户名里出现引号且带 OR / -- 注释符
    const isInjection =
      username.includes("'") &&
      (username.toUpperCase().includes("OR") || username.includes("--"));
    setResult(isInjection ? "success" : "fail");
  }

  const inputCls =
    "w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 font-mono text-sm outline-none transition-colors focus:border-indigo-500 dark:border-zinc-700";

  return (
    <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
      <h3 className="font-semibold">💉 {t("sqlTitle")}</h3>
      <p className="mt-1.5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {t("sqlHint")}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-zinc-600 dark:text-zinc-400">
          {t("sqlUsername")}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            className={`mt-1 ${inputCls}`}
          />
        </label>
        <label className="text-sm text-zinc-600 dark:text-zinc-400">
          {t("sqlPassword")}
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456"
            className={`mt-1 ${inputCls}`}
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={login}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          {t("sqlLogin")}
        </button>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("sqlPayloads")}</p>
        <button
          type="button"
          onClick={() => {
            setUsername("' OR '1'='1");
            setPassword("");
          }}
          className="rounded-full border border-rose-300 px-2.5 py-1 font-mono text-xs text-rose-600 transition-colors hover:border-rose-400 dark:border-rose-800 dark:text-rose-400"
        >
          {"' OR '1'='1"}
        </button>
        <button
          type="button"
          onClick={() => {
            setUsername("admin'--");
            setPassword("");
          }}
          className="rounded-full border border-rose-300 px-2.5 py-1 font-mono text-xs text-rose-600 transition-colors hover:border-rose-400 dark:border-rose-800 dark:text-rose-400"
        >
          {"admin'--"}
        </button>
      </div>

      {attempted && (
        <div className="mt-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("sqlQuery")}</p>
          <div className="mt-1.5 overflow-x-auto rounded-lg bg-zinc-950 p-3 font-mono text-xs leading-6 text-zinc-300">
            <span className="text-sky-400">SELECT</span> * <span className="text-sky-400">FROM</span> users{" "}
            <span className="text-sky-400">WHERE</span> username ={" "}
            <span className="text-emerald-400">&apos;{attempted.u}&apos;</span>{" "}
            <span className="text-sky-400">AND</span> password ={" "}
            <span className="text-emerald-400">&apos;{attempted.p}&apos;</span>
          </div>

          {result === "success" ? (
            <p className="mt-3 rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              🎉 {t("sqlSuccess")}
            </p>
          ) : (
            <p className="mt-3 rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              ❌ {t("sqlFail")}
            </p>
          )}
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        {t("sqlNote")}
      </p>
    </div>
  );
}
