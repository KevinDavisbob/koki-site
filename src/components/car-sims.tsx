"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type SimKey = "engine" | "gear" | "accel" | "fuel";

const simMeta: { key: SimKey; icon: string }[] = [
  { key: "engine", icon: "🔥" },
  { key: "gear", icon: "⚙️" },
  { key: "accel", icon: "🏁" },
  { key: "fuel", icon: "⛽" },
];

export function CarSims() {
  const t = useTranslations("Cars");
  const [active, setActive] = useState<SimKey>("engine");

  const titles: Record<SimKey, string> = {
    engine: t("engineTitle"),
    gear: t("gearTitle"),
    accel: t("accelTitle"),
    fuel: t("fuelTitle"),
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
