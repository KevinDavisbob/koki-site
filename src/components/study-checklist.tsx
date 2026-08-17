"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import type { SecurityStage } from "@/lib/security";

const STORAGE_KEY = "koki-security-checklist";

// localStorage 作为外部存储：模块级缓存 + 订阅通知
let cached: boolean[] | null = null;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function readSnapshot(): boolean[] | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      cached = JSON.parse(saved) as boolean[];
    }
  } catch {
    // 忽略损坏的存档
  }
  return cached;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function updateChecklist(prev: boolean[], index: number) {
  const next = [...prev];
  next[index] = !next[index];
  cached = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 存储不可用时静默失败
  }
  emitChange();
}

export function StudyChecklist({ stages }: { stages: SecurityStage[] }) {
  const t = useTranslations("Security");
  const saved = useSyncExternalStore(subscribe, readSnapshot, () => null);
  const done = saved ?? stages.map(() => false);

  function toggle(index: number) {
    updateChecklist(done, index);
  }

  const doneCount = done.filter(Boolean).length;
  const percent = Math.round((doneCount / stages.length) * 100);

  return (
    <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
      {/* 进度条 */}
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {t("checklistProgress")}：{doneCount}/{stages.length}
        </p>
        <p className="text-sm font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
          {percent}%
        </p>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* 阶段打卡 */}
      <ul className="mt-4 flex flex-col gap-2">
        {stages.map((stage, index) => (
          <li key={stage.key}>
            <button
              type="button"
              onClick={() => toggle(index)}
              className={`flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${
                done[index]
                  ? "border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30"
                  : "border-zinc-200 hover:border-indigo-300 dark:border-zinc-800 dark:hover:border-indigo-700"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                  done[index]
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-zinc-300 dark:border-zinc-600"
                }`}
              >
                {done[index] ? "✓" : ""}
              </span>
              <span className="flex-1">
                <span className={done[index] ? "text-zinc-400 line-through" : ""}>
                  {stage.title}
                </span>
                <span className="ml-2 text-xs text-zinc-400">{stage.duration}</span>
              </span>
              <span className="shrink-0 text-xs text-zinc-400">
                {done[index] ? t("stageDone") : t("stageTodo")}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {percent === 100 && (
        <p className="mt-3 text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          🏆 全部通关！你已经正式「入土」——欢迎来到安全的世界。
        </p>
      )}
    </div>
  );
}
