"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type SimKey = "brushed" | "brushless";

export function MotorSims() {
  const t = useTranslations("Physics");
  const [active, setActive] = useState<SimKey>("brushed");

  return (
    <div>
      <nav className="flex flex-wrap gap-2">
        {(
          [
            { key: "brushed", icon: "⚡", label: t("brushedSim") },
            { key: "brushless", icon: "🔀", label: t("brushlessSim") },
          ] as { key: SimKey; icon: string; label: string }[]
        ).map(({ key, icon, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
              active === key
                ? "bg-indigo-600 text-white"
                : "border border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500"
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </nav>
      <div className="mt-5 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        {active === "brushed" ? <BrushedSim t={t} /> : <BrushlessSim t={t} />}
      </div>
    </div>
  );
}

type PhysicsT = ReturnType<typeof useTranslations<"Physics">>;

/* 通用：rAF 驱动的角度状态 */
function useMotorAngle(speed: number, running: boolean, degreesPerMs = 0.06) {
  const [angle, setAngle] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      setAngle((a) => (a + dt * speed * degreesPerMs) % 360);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speed, running, degreesPerMs]);

  return angle;
}

function SpeedControl({
  t,
  speed,
  setSpeed,
  running,
  setRunning,
}: {
  t: PhysicsT;
  speed: number;
  setSpeed: (n: number) => void;
  running: boolean;
  setRunning: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex w-full max-w-xs items-center gap-3">
      <button
        type="button"
        onClick={() => setRunning((r) => !r)}
        className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
      >
        {running ? t("pause") : t("start")}
      </button>
      <label className="flex flex-1 items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t("speed")}
        <input
          type="range"
          min={1}
          max={6}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="flex-1 accent-indigo-600"
        />
        <span className="w-4 text-right tabular-nums">{speed}</span>
      </label>
    </div>
  );
}

/* ---------------- 有刷直流电机 ---------------- */

function BrushedSim({ t }: { t: PhysicsT }) {
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(2);
  const angle = useMotorAngle(speed, running, 0.12);

  // 每半圈（180°）换向一次
  const halfTurn = Math.floor(angle / 180) % 2 === 0;
  const commuting = angle % 180 < 8; // 换向瞬间高亮

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        {t("brushedHint")}
      </p>
      <svg viewBox="0 0 300 300" className="w-full max-w-xs" role="img">
        {/* 外壳 */}
        <circle cx="150" cy="150" r="120" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-300 dark:text-zinc-700" />
        {/* 定子磁铁（固定） */}
        <rect x="30" y="138" width="22" height="24" rx="4" fill="#ef4444" />
        <text x="41" y="175" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ef4444">N</text>
        <rect x="248" y="138" width="22" height="24" rx="4" fill="#3b82f6" />
        <text x="259" y="175" textAnchor="middle" fontSize="11" fontWeight="700" fill="#3b82f6">S</text>

        {/* 转子（随角度旋转）：电枢线圈 + 换向器 */}
        <g transform={`rotate(${angle} 150 150)`}>
          {/* 电枢 */}
          <circle cx="150" cy="150" r="56" fill="#fafafa" stroke="currentColor" strokeWidth="2.5" className="text-zinc-400 dark:text-zinc-600 dark:fill-zinc-800" />
          <path d="M 150 94 A 56 56 0 0 1 206 150 L 150 150 Z" fill="#f87171" opacity="0.85" />
          <path d="M 206 150 A 56 56 0 0 1 150 206 L 150 150 Z" fill="#60a5fa" opacity="0.85" />
          {/* 线圈绕组示意 */}
          <ellipse cx="150" cy="150" rx="14" ry="42" fill="none" stroke="#a16207" strokeWidth="3" />
          {/* 换向器（分两瓣） */}
          <circle cx="150" cy="150" r="20" fill="none" stroke="#71717a" strokeWidth="2" />
          <path d="M 150 130 A 20 20 0 0 1 170 150 L 150 150 Z" fill="#d4a017" />
          <path d="M 170 150 A 20 20 0 0 1 150 170 L 150 150 Z" fill="#b8860b" />
        </g>

        {/* 电刷（固定）：上下两个，压在换向器上 */}
        <rect x="143" y="106" width="14" height="26" rx="3" fill="#374151" />
        <rect x="143" y="168" width="14" height="26" rx="3" fill="#374151" />
        <text x="118" y="122" fontSize="12" fontWeight="700" fill="#dc2626">+</text>
        <text x="118" y="194" fontSize="12" fontWeight="700" fill="#2563eb">−</text>

        {/* 电流方向箭头（每半圈翻转） */}
        <line x1="118" y1="119" x2="138" y2="119" stroke="#dc2626" strokeWidth="2" markerEnd={halfTurn ? "url(#arrR)" : "url(#arrR2)"} />
        <line x1="138" y1="181" x2="118" y2="181" stroke="#2563eb" strokeWidth="2" markerEnd={halfTurn ? "url(#arrB)" : "url(#arrB2)"} />
        <defs>
          <marker id="arrR" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#dc2626" /></marker>
          <marker id="arrR2" viewBox="0 0 8 8" refX="0" refY="4" markerWidth="8" markerHeight="8" orient="auto"><path d="M8 0 L0 4 L8 8 Z" fill="#dc2626" /></marker>
          <marker id="arrB" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#2563eb" /></marker>
          <marker id="arrB2" viewBox="0 0 8 8" refX="0" refY="4" markerWidth="8" markerHeight="8" orient="auto"><path d="M8 0 L0 4 L8 8 Z" fill="#2563eb" /></marker>
        </defs>

        {/* 换向提示 */}
        {commuting && (
          <text x="150" y="244" textAnchor="middle" fontSize="14" fontWeight="700" fill="#f59e0b">
            ⚡ {t("commutation")}
          </text>
        )}
      </svg>

      <SpeedControl t={t} speed={speed} setSpeed={setSpeed} running={running} setRunning={setRunning} />
      <p className="max-w-sm text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        {t("brushedNote")}
      </p>
    </div>
  );
}

/* ---------------- 无刷直流电机（三相旋转磁场） ---------------- */

const PHASES = [
  { label: "A+", angle: 0, color: "#dc2626" },
  { label: "C−", angle: 60, color: "#2563eb" },
  { label: "B+", angle: 120, color: "#16a34a" },
  { label: "A−", angle: 180, color: "#dc2626" },
  { label: "C+", angle: 240, color: "#2563eb" },
  { label: "B−", angle: 300, color: "#16a34a" },
];

function BrushlessSim({ t }: { t: PhysicsT }) {
  const [running, setRunning] = useState(true);
  const [freq, setFreq] = useState(30); // 供电频率 Hz
  const angle = useMotorAngle(freq, running, 6); // 6°/ms × freq → 转速 ∝ 频率

  // 同步转速 n = 60f / p（极对数 p = 1）
  const rpm = 60 * freq;

  // 线圈位置（弧度制，6 组）
  const coilAngles = PHASES.map((p) => (p.angle * Math.PI) / 180);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        {t("brushlessHint")}
      </p>
      <svg viewBox="0 0 300 300" className="w-full max-w-xs" role="img">
        <circle cx="150" cy="150" r="120" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-300 dark:text-zinc-700" />

        {/* 定子线圈：6 组，按相位着色，通电时点亮 */}
        {coilAngles.map((rad, i) => {
          const phase = PHASES[i];
          const cx = 150 + Math.cos(rad) * 100;
          const cy = 150 + Math.sin(rad) * 100;
          // 旋转磁场指向该线圈附近时点亮（±50°）
          const fieldRad = (angle * Math.PI) / 180;
          let diff = Math.abs(fieldRad - rad) % (Math.PI * 2);
          if (diff > Math.PI) diff = Math.PI * 2 - diff;
          const on = diff < (50 * Math.PI) / 180;
          return (
            <g key={phase.label} transform={`translate(${cx} ${cy}) rotate(${(rad * 180) / Math.PI})`}>
              <rect x="-16" y="-13" width="32" height="26" rx="5" fill={on ? phase.color : "none"} stroke={phase.color} strokeWidth="2" opacity={on ? 1 : 0.45} />
              <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="700" fill={on ? "#fff" : phase.color}>
                {phase.label}
              </text>
            </g>
          );
        })}

        {/* 旋转磁场方向箭头 */}
        <g transform={`rotate(${angle} 150 150)`}>
          <line x1="150" y1="150" x2="150" y2="62" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#fieldArrow)" />
        </g>
        <defs>
          <marker id="fieldArrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="9" markerHeight="9" orient="auto">
            <path d="M0 0 L10 5 L0 10 Z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* 转子：永磁体，跟随旋转磁场（几乎同步，落后一个小角度） */}
        <g transform={`rotate(${angle} 150 150)`}>
          <circle cx="150" cy="150" r="42" fill="#fafafa" stroke="currentColor" strokeWidth="2.5" className="text-zinc-400 dark:text-zinc-600 dark:fill-zinc-800" />
          <path d="M 150 108 A 42 42 0 0 1 192 150 L 150 150 Z" fill="#ef4444" />
          <path d="M 192 150 A 42 42 0 0 1 150 192 L 150 150 Z" fill="#3b82f6" />
          <text x="150" y="128" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">N</text>
          <text x="150" y="172" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">S</text>
        </g>
      </svg>

      {/* 频率滑块 + 同步转速 */}
      <label className="flex w-full max-w-xs items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t("frequency")}
        <input
          type="range"
          min={2}
          max={60}
          value={freq}
          onChange={(e) => setFreq(Number(e.target.value))}
          className="flex-1 accent-indigo-600"
        />
        <span className="w-16 text-right tabular-nums">{freq} Hz</span>
      </label>
      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
        n = 60 × {freq} / 1 = <span className="tabular-nums">{rpm}</span> rpm
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          {running ? t("pause") : t("start")}
        </button>
      </div>
      <p className="max-w-sm text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        {t("brushlessNote")}
      </p>
    </div>
  );
}
