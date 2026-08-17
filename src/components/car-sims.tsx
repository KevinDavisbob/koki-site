"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type SimKey = "engine" | "gear" | "accel" | "fuel" | "suspension" | "battery" | "vvt";

const simMeta: { key: SimKey; icon: string }[] = [
  { key: "engine", icon: "🔥" },
  { key: "gear", icon: "⚙️" },
  { key: "accel", icon: "🏁" },
  { key: "fuel", icon: "⛽" },
  { key: "suspension", icon: "🪝" },
  { key: "battery", icon: "🔋" },
  { key: "vvt", icon: "⏱️" },
];

export function CarSims() {
  const t = useTranslations("Cars");
  const [active, setActive] = useState<SimKey>("engine");

  const titles: Record<SimKey, string> = {
    engine: t("engineTitle"),
    gear: t("gearTitle"),
    accel: t("accelTitle"),
    fuel: t("fuelTitle"),
    suspension: t("suspensionTitle"),
    battery: t("batteryTitle"),
    vvt: t("vvtTitle"),
  };

  return (
    <div>
      {/* 模拟器子导航（选项卡） */}
      <nav className="flex flex-wrap gap-2">
        {simMeta.map(({ key, icon }) => (
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
            {icon} {titles[key]}
          </button>
        ))}
      </nav>

      <div className="mt-5 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        {active === "engine" && <EngineSim t={t} />}
        {active === "gear" && <GearSim t={t} />}
        {active === "accel" && <AccelSim t={t} />}
        {active === "fuel" && <FuelSim t={t} />}
        {active === "suspension" && <SuspensionSim t={t} />}
        {active === "battery" && <BatterySim t={t} />}
        {active === "vvt" && <VvtSim t={t} />}
      </div>
    </div>
  );
}

type CarsT = ReturnType<typeof useTranslations<"Cars">>;

/* ---------------- 四冲程发动机动画 ---------------- */

const CRANK_X = 160;
const CRANK_Y = 208;
const CRANK_R = 30;
const ROD_LEN = 95;
const PISTON_H = 34;

// 曲柄滑块机构：活塞销到曲轴中心的竖直距离 = r·cosθ + √(L² - (r·sinθ)²)
function pistonPinY(deg: number) {
  const rad = (deg * Math.PI) / 180;
  return CRANK_Y - (Math.cos(rad) * CRANK_R + Math.sqrt(ROD_LEN ** 2 - (Math.sin(rad) * CRANK_R) ** 2));
}

function EngineSim({ t }: { t: CarsT }) {
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(2); // 1-5
  const [angle, setAngle] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      // 曲轴角度推进：速度档位 × 每毫秒约 0.2°
      setAngle((a) => (a + (dt * speed * 0.25)) % 720);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, speed]);

  const phase = Math.floor(angle / 180); // 0 进气 1 压缩 2 做功 3 排气
  const phaseNames = [t("intake"), t("compression"), t("power"), t("exhaust")];
  const phaseColors = ["#0ea5e9", "#f59e0b", "#ef4444", "#71717a"];

  const pinY = pistonPinY(angle);
  const pistonTop = pinY - PISTON_H / 2;
  const crankRad = (angle * Math.PI) / 180;
  const crankEndX = CRANK_X + Math.cos(crankRad) * CRANK_R;
  const crankEndY = CRANK_Y + Math.sin(crankRad) * CRANK_R;

  // 气门开度：进气冲程开进气门，排气冲程开排气门
  const intakeOpen = phase === 0;
  const exhaustOpen = phase === 3;

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        {t("engineHint")}
      </p>
      <svg viewBox="0 0 320 280" className="w-full max-w-xs" role="img">
        {/* 气缸 */}
        <rect x="118" y="24" width="84" height="136" fill="none" stroke="currentColor" strokeWidth="3" rx="4" className="text-zinc-400 dark:text-zinc-600" />
        {/* 气缸盖 */}
        <rect x="112" y="20" width="96" height="10" rx="3" fill="currentColor" className="text-zinc-500 dark:text-zinc-500" />
        {/* 火花塞 */}
        <rect x="156" y="14" width="8" height="8" rx="2" fill="#ef4444" opacity={phase === 2 && angle % 180 < 30 ? 1 : 0.35} />
        {/* 进气门 / 排气门 */}
        <rect x="126" y={intakeOpen ? 26 : 14} width="6" height="14" fill="#0ea5e9" opacity={intakeOpen ? 1 : 0.4} />
        <rect x="188" y={exhaustOpen ? 26 : 14} width="6" height="14" fill="#71717a" opacity={exhaustOpen ? 1 : 0.4} />
        {/* 活塞 */}
        <rect x="124" y={pistonTop} width="72" height={PISTON_H} rx="3" fill="currentColor" className="text-zinc-700 dark:text-zinc-300" />
        {/* 连杆：从曲柄销到活塞销 */}
        <line x1={crankEndX} y1={crankEndY} x2="160" y2={pinY} stroke="currentColor" strokeWidth="5" className="text-zinc-500 dark:text-zinc-400" />
        {/* 曲轴 */}
        <circle cx={CRANK_X} cy={CRANK_Y} r="8" fill="currentColor" className="text-zinc-700 dark:text-zinc-300" />
        <circle cx={crankEndX} cy={crankEndY} r="5" fill="currentColor" className="text-zinc-600 dark:text-zinc-400" />
        <circle cx={CRANK_X} cy={CRANK_Y} r={CRANK_R + 12} fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-zinc-300 dark:text-zinc-700" />
        {/* 冲程标签 */}
        <text x="160" y="252" textAnchor="middle" fontSize="18" fontWeight="700" fill={phaseColors[phase]}>
          {phaseNames[phase]}
        </text>
        {/* 混合气示意 */}
        <circle cx="160" cy={phase === 0 ? 90 : 60} r={phase === 2 ? 14 : 10} fill={phaseColors[phase]} opacity={0.25} />
      </svg>

      <div className="flex w-full max-w-xs items-center gap-3">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          {running ? t("engineStop") : t("engineStart")}
        </button>
        <label className="flex flex-1 items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          {t("engineSpeed")}
          <input
            type="range"
            min={1}
            max={5}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="flex-1 accent-indigo-600"
          />
          <span className="w-4 text-right tabular-nums">{speed}</span>
        </label>
      </div>
    </div>
  );
}

/* ---------------- 变速箱模拟 ---------------- */

// 典型 6 速手动变速箱传动比 + 主减速比
const GEAR_RATIOS = [3.55, 2.05, 1.37, 1.0, 0.8, 0.65];
const FINAL_DRIVE = 3.9;
const WHEEL_RADIUS_M = 0.33;

function GearSim({ t }: { t: CarsT }) {
  const [gear, setGear] = useState<number | "R">(1);
  const [rpm, setRpm] = useState(2000);

  let ratio: number;
  if (gear === "R") ratio = 3.5;
  else ratio = GEAR_RATIOS[gear - 1];

  const totalRatio = ratio * FINAL_DRIVE;
  const wheelRpm = rpm / totalRatio;
  const speedKmh = ((wheelRpm * 2 * Math.PI) / 60) * WHEEL_RADIUS_M * 3.6;
  const speed = Math.max(0, speedKmh);

  const maxSpeed = 260;
  const barWidth = Math.min(100, (speed / maxSpeed) * 100);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("gearHint")}</p>

      <div className="flex flex-wrap justify-center gap-2">
        {["R", 1, 2, 3, 4, 5, 6].map((g) => (
          <button
            key={String(g)}
            type="button"
            onClick={() => setGear(g as number | "R")}
            className={`h-11 w-11 rounded-lg border text-sm font-semibold transition-colors ${
              gear === g
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            {g === "R" ? t("gearReverse") : g === 1 ? "1" : g}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t("rpm")}
        <input
          type="range"
          min={800}
          max={7000}
          step={100}
          value={rpm}
          onChange={(e) => setRpm(Number(e.target.value))}
          className="flex-1 accent-indigo-600"
        />
        <span className="w-20 text-right tabular-nums">{rpm} rpm</span>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-zinc-100 px-4 py-3 text-sm dark:bg-zinc-900">
          <p className="text-zinc-500 dark:text-zinc-400">{t("gearRatio")}</p>
          <p className="mt-1 text-lg font-bold tabular-nums">
            {ratio.toFixed(2)} <span className="text-xs font-normal text-zinc-400">× {FINAL_DRIVE}（主减速比）</span>
          </p>
        </div>
        <div className="rounded-lg bg-zinc-100 px-4 py-3 text-sm dark:bg-zinc-900">
          <p className="text-zinc-500 dark:text-zinc-400">{t("vehicleSpeed")}</p>
          <p className="mt-1 text-lg font-bold tabular-nums">{speed.toFixed(0)} km/h</p>
        </div>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700 transition-[width] duration-150"
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">{t("gearNote")}</p>
    </div>
  );
}

/* ---------------- 0-100 加速估算 ---------------- */

const DRIVE_CORRECTION = { fwd: 0.3, rwd: -0.1, awd: -0.3 } as const;

function AccelSim({ t }: { t: CarsT }) {
  const [hp, setHp] = useState(200);
  const [kg, setKg] = useState(1400);
  const [drive, setDrive] = useState<keyof typeof DRIVE_CORRECTION>("fwd");
  const [runId, setRunId] = useState(0);
  const [progress, setProgress] = useState(0);

  // 经验公式：0-100 ≈ 0.8 + 2.3 × √(车重/马力) + 驱动修正
  const seconds =
    Math.max(1.5, 0.8 + 2.3 * Math.sqrt(kg / Math.max(hp, 50)) + DRIVE_CORRECTION[drive]);
  const hpPerTon = (hp / kg) * 1000;

  function run() {
    setRunId((n) => n + 1);
    setProgress(0);
  }

  // 模拟动画：速度从 0 匀速增长到 100%，时长与实际估算秒数成比例（视觉上限 6 秒）
  useEffect(() => {
    if (runId === 0) return;
    const duration = Math.min(Math.max(seconds, 2) * 1000, 6000);
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // 加速感：后段稍慢（空气阻力）
      setProgress(1 - Math.pow(1 - p, 1.3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [runId, seconds]);

  const inputCls =
    "w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-500 dark:border-zinc-700";

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("accelHint")}</p>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm text-zinc-600 dark:text-zinc-400">
          {t("accelHp")}
          <input
            type="number"
            min={60}
            max={1200}
            value={hp}
            onChange={(e) => setHp(Number(e.target.value))}
            className={`mt-1 ${inputCls}`}
          />
        </label>
        <label className="text-sm text-zinc-600 dark:text-zinc-400">
          {t("accelWeight")}
          <input
            type="number"
            min={600}
            max={3500}
            value={kg}
            onChange={(e) => setKg(Number(e.target.value))}
            className={`mt-1 ${inputCls}`}
          />
        </label>
        <label className="text-sm text-zinc-600 dark:text-zinc-400">
          {t("accelDrive")}
          <select
            value={drive}
            onChange={(e) => setDrive(e.target.value as keyof typeof DRIVE_CORRECTION)}
            className={`mt-1 ${inputCls}`}
          >
            <option value="fwd">{t("accelFwd")}</option>
            <option value="rwd">{t("accelRwd")}</option>
            <option value="awd">{t("accelAwd")}</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={run}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          🏁 {t("accelRun")}
        </button>
        <div className="text-sm">
          <p className="font-bold text-indigo-600 dark:text-indigo-400">
            {t("accelResult", { t: seconds.toFixed(1) })}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {t("accelRatio", { r: hpPerTon.toFixed(0) })}
          </p>
        </div>
      </div>

      {/* 速度表动画 */}
      <div className="flex items-center gap-3">
        <span className="w-24 text-right font-mono text-xl font-bold tabular-nums">
          {Math.round(progress * 100)}
        </span>
        <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-500 transition-none"
            style={{ width: `${progress * 100}%` }}
          />
          <span className="absolute right-0 top-4 text-xs text-zinc-400">100 km/h</span>
        </div>
      </div>
      <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">{t("accelNote")}</p>
    </div>
  );
}

/* ---------------- 用车成本计算器 ---------------- */

function FuelSim({ t }: { t: CarsT }) {
  const [consumption, setConsumption] = useState(8); // L/100km
  const [price, setPrice] = useState(8); // 元/L
  const [km, setKm] = useState(1000); // 每月 km

  const monthly = (km / 100) * consumption * price;
  const yearly = monthly * 12;

  const inputCls =
    "w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-500 dark:border-zinc-700";

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("fuelHint")}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm text-zinc-600 dark:text-zinc-400">
          {t("fuelConsumption")}
          <input
            type="number"
            min={0}
            step={0.1}
            value={consumption}
            onChange={(e) => setConsumption(Number(e.target.value))}
            className={`mt-1 ${inputCls}`}
          />
        </label>
        <label className="text-sm text-zinc-600 dark:text-zinc-400">
          {t("fuelPrice")}
          <input
            type="number"
            min={0}
            step={0.1}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className={`mt-1 ${inputCls}`}
          />
        </label>
        <label className="text-sm text-zinc-600 dark:text-zinc-400">
          {t("fuelKm")}
          <input
            type="number"
            min={0}
            value={km}
            onChange={(e) => setKm(Number(e.target.value))}
            className={`mt-1 ${inputCls}`}
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-zinc-100 px-4 py-3 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("fuelMonthly")}</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
            ¥ {monthly.toFixed(0)}
          </p>
        </div>
        <div className="rounded-lg bg-zinc-100 px-4 py-3 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("fuelYearly")}</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
            ¥ {yearly.toFixed(0)}
          </p>
        </div>
      </div>
      <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">{t("fuelNote")}</p>
    </div>
  );
}

/* ---------------- 悬挂弹簧阻尼模拟 ---------------- */

// 简化弹簧-阻尼模型：a = -k·y - c·v（质量归一化为 1）
const SPRING_K = 0.045;
const DAMPING_PRESETS = { soft: 0.02, mid: 0.09, hard: 0.2 } as const;

function SuspensionSim({ t }: { t: CarsT }) {
  const [mode, setMode] = useState<keyof typeof DAMPING_PRESETS>("mid");
  const [y, setY] = useState(0); // 车身位移（px，正=向下）
  const yRef = useRef(0);
  const vRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // 常驻物理循环
  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.7, 3); // 归一化到 ~60fps 步长
      last = now;
      const c = DAMPING_PRESETS[mode];
      const a = -SPRING_K * yRef.current - c * vRef.current;
      vRef.current += a * dt;
      yRef.current += vRef.current * dt;
      // 地面限制
      if (yRef.current > 60) {
        yRef.current = 60;
        vRef.current = Math.min(vRef.current, 0);
      }
      if (yRef.current < -60) {
        yRef.current = -60;
        vRef.current = Math.max(vRef.current, 0);
      }
      setY(yRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mode]);

  function bump() {
    vRef.current -= 26; // 车轮受到向上的冲击
  }

  function reset() {
    yRef.current = 0;
    vRef.current = 0;
    setY(0);
  }

  // 弹簧间隙（随车身位置伸缩），画成左右交替的之字形
  const gapTop = 92 + y; // 车身底部
  const gapBottom = 178; // 车轮顶部
  const gap = Math.max(10, gapBottom - gapTop);
  const coils = 6;
  const xs = [118, 162];
  const zigzag: string[] = [];
  for (let i = 0; i <= coils; i++) {
    const px = xs[i % 2];
    const py = gapTop + (i / coils) * gap;
    zigzag.push(`${px},${py}`);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        {t("suspensionHint")}
      </p>
      <svg viewBox="0 0 300 220" className="w-full max-w-xs" role="img">
        {/* 地面 */}
        <line x1="20" y1="205" x2="280" y2="205" stroke="currentColor" strokeWidth="3" className="text-zinc-400 dark:text-zinc-600" />
        {/* 减速带 */}
        <path d="M 235 205 Q 250 195 265 205" fill="none" stroke="#f59e0b" strokeWidth="4" />

        {/* 车轮（固定） */}
        <circle cx="140" cy="190" r="16" fill="#27272a" />
        <circle cx="140" cy="190" r="7" fill="#a1a1aa" />

        {/* 弹簧（绿色，随间隙伸缩） */}
        <polyline points={zigzag.join(" ")} fill="none" stroke="#16a34a" strokeWidth="3" />
        {/* 减震器（黄色） */}
        <line x1="186" y1={gapTop} x2="186" y2={gapTop + gap * 0.6} stroke="#f59e0b" strokeWidth="4" />
        <rect x="180" y={gapTop + gap * 0.6} width="12" height={gap * 0.4} rx="2" fill="none" stroke="#f59e0b" strokeWidth="2" />

        {/* 车身（随 y 移动） */}
        <g transform={`translate(0 ${y})`}>
          <rect x="70" y="48" width="160" height="44" rx="12" fill="#6366f1" opacity="0.9" />
          <rect x="90" y="56" width="40" height="12" rx="3" fill="#e4e4e7" opacity="0.8" />
          <rect x="170" y="56" width="40" height="12" rx="3" fill="#e4e4e7" opacity="0.8" />
        </g>
        <line x1="70" y1={92 + y} x2="230" y2={92 + y} stroke="#4f46e5" strokeWidth="2" opacity="0.5" />
      </svg>

      {/* 阻尼模式 */}
      <div className="flex flex-wrap justify-center gap-2">
        {(
          [
            { key: "soft", label: t("suspensionSoft") },
            { key: "mid", label: t("suspensionMid") },
            { key: "hard", label: t("suspensionHard") },
          ] as { key: keyof typeof DAMPING_PRESETS; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
              mode === key
                ? "bg-indigo-600 text-white"
                : "border border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={bump}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-400"
        >
          {t("suspensionBump")}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:border-zinc-400 dark:border-zinc-700"
        >
          {t("suspensionReset")}
        </button>
      </div>

      <p className="max-w-sm text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        {mode === "soft"
          ? t("suspensionSoftNote")
          : mode === "hard"
            ? t("suspensionHardNote")
            : t("suspensionExplain")}
      </p>
    </div>
  );
}

/* ---------------- 电池与动能回收模拟 ---------------- */

function BatterySim({ t }: { t: CarsT }) {
  const [soc, setSoc] = useState(80);
  const [power, setPower] = useState(0); // kW，正=消耗，负=回收
  const [flash, setFlash] = useState<"drain" | "regen" | null>(null);

  function act(delta: number, kw: number) {
    setSoc((s) => Math.min(100, Math.max(0, s + delta)));
    setPower(kw);
    setFlash(kw < 0 ? "regen" : "drain");
    setTimeout(() => setFlash(null), 600);
  }

  const socColor = soc > 50 ? "bg-emerald-500" : soc > 20 ? "bg-amber-500" : "bg-rose-500";
  const regen = power < 0;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("batteryHint")}</p>

      {/* SOC 电量条 */}
      <div>
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{t("batterySoc")}</p>
          <p className="text-xl font-bold tabular-nums">{Math.round(soc)}%</p>
        </div>
        <div className="mt-2 h-5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
          <div
            className={`h-full rounded-full transition-all duration-300 ${socColor}`}
            style={{ width: `${soc}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-zinc-400">
          ≈ {Math.round(soc * 4.5)} km（按 22 kWh/100km 估算）
        </p>
      </div>

      {/* 功率表 */}
      <div className="rounded-lg bg-zinc-100 px-4 py-3 dark:bg-zinc-900">
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("batteryPower")}</p>
          <p
            className={`text-lg font-bold tabular-nums ${
              regen ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {power > 0 ? `+${power}` : power} kW
          </p>
        </div>
        {/* 功率指针条：中点 0，向右消耗，向左回收 */}
        <div className="relative mt-2 h-3 rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-zinc-400" />
          {regen ? (
            <div
              className="absolute right-1/2 top-0 h-full rounded-l-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${Math.min(50, (Math.abs(power) / 200) * 100) / 2}%` }}
            />
          ) : (
            <div
              className="absolute left-1/2 top-0 h-full rounded-r-full bg-rose-500 transition-all duration-300"
              style={{ width: `${Math.min(50, (Math.abs(power) / 200) * 100) / 2}%` }}
            />
          )}
        </div>
        {flash === "regen" && (
          <p className="mt-2 text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            ⚡ {t("batteryRegen")} → {t("batterySoc")} ↑
          </p>
        )}
      </div>

      {/* 驾驶操作 */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => act(-2.5, 150)}
          className="rounded-lg bg-rose-600 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-500"
        >
          🚀 {t("batteryAccel")} (-2.5%)
        </button>
        <button
          type="button"
          onClick={() => act(-0.4, 20)}
          className="rounded-lg bg-zinc-500 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-400"
        >
          🛣️ {t("batteryCruise")} (-0.4%)
        </button>
        <button
          type="button"
          onClick={() => act(0.3, -10)}
          className="rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          🪂 {t("batteryCoast")} (+0.3%)
        </button>
        <button
          type="button"
          onClick={() => act(1.0, -40)}
          className="rounded-lg bg-emerald-700 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
        >
          🛑 {t("batteryBrake")} (+1.0%)
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          setSoc(80);
          setPower(0);
          setFlash(null);
        }}
        className="self-center rounded-lg border border-zinc-300 px-4 py-1.5 text-sm font-medium transition-colors hover:border-zinc-400 dark:border-zinc-700"
      >
        {t("batteryReset")}
      </button>

      <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">{t("batteryNote")}</p>
    </div>
  );
}

/* ---------------- VVT 气门正时模拟 ---------------- */

function valveLift(theta: number, center: number, duration: number) {
  const lift = (1 + Math.cos((2 * Math.PI * (theta - center)) / duration)) / 2;
  return lift > 0.001 ? lift : 0;
}

function VvtSim({ t }: { t: CarsT }) {
  const [overlap, setOverlap] = useState(20); // 气门重叠角（°）

  // 排气门：中心 360°（排气上止点前开启、后关闭）
  const exhaustCenter = 360;
  const exhaustDuration = 240;
  // 进气门：上止点（720°/0°）前 overlap/2 开启
  const intakeOpen = 720 - overlap / 2;
  const intakeCenter = (intakeOpen + (intakeOpen + 240)) / 2;

  // 生成曲线路径
  const steps = 360;
  const intakePath: string[] = [];
  const exhaustPath: string[] = [];
  let overlapStart: number | null = null;
  let overlapEnd: number | null = null;

  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * 720;
    const x = 40 + (theta / 720) * 220;
    const inLift = valveLift(theta, intakeCenter, 240);
    const exLift = valveLift(theta, exhaustCenter, exhaustDuration);
    const yIn = 150 - inLift * 120;
    const yEx = 150 - exLift * 120;
    intakePath.push(`${x},${yIn}`);
    exhaustPath.push(`${x},${yEx}`);
    if (inLift > 0 && exLift > 0) {
      if (overlapStart === null) overlapStart = theta;
      overlapEnd = theta;
    }
  }

  // 重叠区域填充多边形
  const fillX = (theta: number) => 40 + (theta / 720) * 220;
  const fillY = (theta: number) => 150 - Math.min(valveLift(theta, intakeCenter, 240), valveLift(theta, exhaustCenter, exhaustDuration)) * 120;
  let overlapFill = "";
  if (overlapStart !== null && overlapEnd !== null) {
    const pts: string[] = [];
    const s = Math.max(0, overlapStart - 10);
    const e = Math.min(720, overlapEnd + 10);
    for (let theta = s; theta <= e; theta += 2) {
      pts.push(`${fillX(theta)},${fillY(theta)}`);
    }
    for (let theta = e; theta >= s; theta -= 2) {
      pts.push(`${fillX(theta)},150`);
    }
    overlapFill = pts.join(" ");
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        {t("vvtHint")}
      </p>
      <svg viewBox="0 0 300 190" className="w-full max-w-xs" role="img">
        {/* 轴 */}
        <line x1="40" y1="150" x2="260" y2="150" stroke="currentColor" strokeWidth="1.5" className="text-zinc-300 dark:text-zinc-700" />
        {/* 上止点 / 下止点标记 */}
        {[
          { x: 40, label: "TDC 0°" },
          { x: 150, label: "BDC" },
          { x: 260, label: "TDC 720°" },
        ].map((m) => (
          <text key={m.label} x={m.x} y="170" textAnchor="middle" fontSize="9" fill="currentColor" className="text-zinc-400">
            {m.label}
          </text>
        ))}

        {/* 重叠区域（进排气同时打开） */}
        {overlapFill && <polygon points={overlapFill} fill="#f43f5e" opacity="0.3" />}

        {/* 排气门曲线 */}
        <polyline points={exhaustPath.join(" ")} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
        {/* 进气门曲线（受 VVT 影响） */}
        <polyline points={intakePath.join(" ")} fill="none" stroke="#6366f1" strokeWidth="2.5" />

        {/* 图例 */}
        <line x1="60" y1="24" x2="80" y2="24" stroke="#6366f1" strokeWidth="2.5" />
        <text x="86" y="28" fontSize="10" fill="#6366f1">进气门</text>
        <line x1="140" y1="24" x2="160" y2="24" stroke="#f59e0b" strokeWidth="2.5" />
        <text x="166" y="28" fontSize="10" fill="#f59e0b">排气门</text>
        <rect x="224" y="18" width="14" height="12" fill="#f43f5e" opacity="0.3" rx="2" />
        <text x="242" y="28" fontSize="10" fill="#f43f5e">重叠角</text>
      </svg>

      <label className="flex w-full max-w-xs items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t("vvtOverlap")}
        <input
          type="range"
          min={0}
          max={60}
          value={overlap}
          onChange={(e) => setOverlap(Number(e.target.value))}
          className="flex-1 accent-indigo-600"
        />
        <span className="w-12 text-right tabular-nums">{overlap}°</span>
      </label>

      <p className="max-w-sm text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        {overlap < 20 ? t("vvtLowSpeed") : t("vvtHighSpeed")}
        <br />
        {t("vvtExplain")}
      </p>
    </div>
  );
}
