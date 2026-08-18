"use client";

import { useEffect, useRef, useState } from "react";

/** 启动脚本：每条在指定毫秒时输出；以 ">" 开头的条目另起一行，其余拼接到上一行 */
const SCRIPT: Part[] = [
  { t: 250, text: "koki.asia bootloader v1.0" },
  { t: 900, text: "> INITIALIZING SYSTEM..." },
  { t: 1400, text: " [OK]", status: true },
  { t: 1750, text: "> LOADING SECURITY MODULES..." },
  { t: 2250, text: " [OK]", status: true },
  { t: 2600, text: "> CHECKING NETWORK..." },
  { t: 3100, text: " [OK]", status: true },
  { t: 3450, text: "> ACCESS GRANTED ✓", status: true },
];

const TOTAL_MS = 4000; // 进度条走满时间
const HOLD_MS = 400; // 走满后短暂停留再淡出

type Part = { t: number; text: string; status?: boolean };

type Phase = "boot" | "exit" | "done";

export function BootScreen() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [elapsed, setElapsed] = useState(0);

  const skip = () => setPhase((p) => (p === "boot" ? "exit" : p));

  // 会话内只显示一次；偏好减少动效则直接跳过。
  // 注意：dev StrictMode 会双挂载，须用 ref 守卫保证只检查一次，
  // 否则第一次写入的标记会被第二次挂载当成"已看过"而立刻关闭。
  const checkedRef = useRef(false);
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    // 通过 rAF 回调执行检查：effect 内同步 setState 违反 react-hooks 规则，
    // 且避免 dev StrictMode 双挂载下第二次挂载被自己写入的标记跳过
    const raf = requestAnimationFrame(() => {
      try {
        if (
          sessionStorage.getItem("boot-shown") ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          setPhase("done");
          return;
        }
        sessionStorage.setItem("boot-shown", "1");
      } catch {
        // sessionStorage 不可用（隐私模式等）时直接播放
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Esc 跳过
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 驱动动画时钟 + 锁定背景滚动
  useEffect(() => {
    if (phase !== "boot") return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const e = now - start;
      setElapsed(e);
      if (e >= TOTAL_MS + HOLD_MS) {
        setPhase("exit");
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "done") return null;

  // 按时间切出已输出的行；">" 开头另起一行，其余拼接到上一行
  const lines: Part[][] = [];
  for (const p of SCRIPT) {
    if (p.t > elapsed) break;
    if (p.text.startsWith(">") || lines.length === 0) lines.push([p]);
    else lines[lines.length - 1].push(p);
  }

  const progress = Math.min(100, Math.round((elapsed / TOTAL_MS) * 100));

  return (
    <div
      className={`boot-screen fixed inset-0 z-[100] flex select-none items-center justify-center bg-[#050805] px-5 ${
        phase === "exit" ? "boot-fade-out" : "boot-fade-in"
      }`}
      onClick={skip}
      onAnimationEnd={() => phase === "exit" && setPhase("done")}
    >
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-green-500/25 bg-green-400/[0.03] p-4 shadow-[0_0_32px_rgba(34,197,94,0.07)] sm:p-6">
          <p className="boot-glow text-xs font-semibold tracking-wide text-green-300 sm:text-sm">
            koki.asia bootloader v1.0
          </p>
          <div className="mb-3 mt-3 border-b border-green-500/15" />
          <div className="min-h-[9rem] font-mono text-[12px] leading-6 sm:text-[13px] sm:leading-7">
            {lines.map((parts, i) => (
              <p key={i}>
                {parts.map((p, j) => (
                  <span
                    key={j}
                    className={
                      p.status ? "text-green-300" : "text-green-500/90"
                    }
                  >
                    {p.text}
                  </span>
                ))}
                {i === lines.length - 1 && phase === "boot" && (
                  <span className="boot-cursor text-green-300">▍</span>
                )}
              </p>
            ))}
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-green-500/15">
            <div
              className="boot-glow h-full rounded-full bg-green-400 transition-[width] duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-[11px] tabular-nums text-green-500">
            {progress}%
          </span>
        </div>
      </div>
      <p className="absolute bottom-4 right-5 font-mono text-[10px] tracking-[0.2em] text-green-500/40">
        CLICK / ESC TO SKIP
      </p>
    </div>
  );
}
