"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type SimKey =
  | "engine"
  | "gear"
  | "accel"
  | "fuel"
  | "suspension"
  | "battery"
  | "vvt"
  | "turbo"
  | "aero"
  | "brake"
  | "dyno"
  | "steering"
  | "awd"
  | "crash";

const simMeta: { key: SimKey; icon: string }[] = [
  { key: "engine", icon: "🔥" },
  { key: "turbo", icon: "🌀" },
  { key: "dyno", icon: "📈" },
  { key: "gear", icon: "⚙️" },
  { key: "suspension", icon: "🪝" },
  { key: "steering", icon: "🔄" },
  { key: "awd", icon: "🛞" },
  { key: "aero", icon: "🌬️" },
  { key: "brake", icon: "🛑" },
  { key: "crash", icon: "💥" },
  { key: "accel", icon: "🏁" },
  { key: "battery", icon: "🔋" },
  { key: "fuel", icon: "⛽" },
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
    turbo: t("turboTitle"),
    aero: t("aeroTitle"),
    brake: t("brakeTitle"),
    dyno: t("dynoTitle"),
    steering: t("steeringTitle"),
    awd: t("awdTitle"),
    crash: t("crashTitle"),
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
        {active === "turbo" && <TurboSim t={t} />}
        {active === "aero" && <AeroSim t={t} />}
        {active === "brake" && <BrakeSim t={t} />}
        {active === "dyno" && <DynoSim t={t} />}
        {active === "steering" && <SteeringSim t={t} />}
        {active === "awd" && <AwdSim t={t} />}
        {active === "crash" && <CrashSim t={t} />}
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

/* ---------------- 涡轮增压模拟 ---------------- */

function TurboSim({ t }: { t: CarsT }) {
  const [throttle, setThrottle] = useState(30);
  const [rpm, setRpm] = useState(2000);
  const [boost, setBoost] = useState(0);
  const [turbineAngle, setTurbineAngle] = useState(0);
  const [blowoff, setBlowoff] = useState(false);
  const boostRef = useRef(0);
  const prevTargetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // 增压物理：目标增压 = 油门 × 转速因子；爬升慢（迟滞 τ=0.7s）、泄压快（τ=0.15s）
  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const rpmFactor = Math.min(1, rpm / 4000);
      const target = (throttle / 100) * rpmFactor * 1.6;
      const tau = target > boostRef.current ? 0.7 : 0.15;
      boostRef.current += ((target - boostRef.current) * dt) / tau;
      if (boostRef.current < 0.01) boostRef.current = 0;
      // 泄压阀：油门大幅回撤且增压较高时触发
      if (prevTargetRef.current - target > 0.5 && boostRef.current > 0.5) {
        setBlowoff(true);
        setTimeout(() => setBlowoff(false), 700);
      }
      prevTargetRef.current = target;
      setBoost(boostRef.current);
      setTurbineAngle((a) => (a + boostRef.current * dt * 2000) % 360);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [throttle, rpm]);

  const turbineRpm = Math.round(boost * 80000); // 万转 = boost × 8 万
  const power = Math.round((rpm / 6500) * 120 * (1 + boost * 0.9));

  const sliderCls = "flex-1 accent-indigo-600";

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        {t("turboHint")}
      </p>
      <svg viewBox="0 0 300 200" className="w-full max-w-xs" role="img">
        {/* 进气（左）：空气 → 压气机 → 中冷器 → 发动机 */}
        <rect x="8" y="86" width="30" height="18" rx="3" fill="#e4e4e7" stroke="#a1a1aa" />
        <line x1="38" y1="95" x2="64" y2="95" stroke="#a1a1aa" strokeWidth="4" />
        {/* 压气机（冷端涡轮） */}
        <circle cx="74" cy="95" r="13" fill="#d4d4d8" stroke="#71717a" strokeWidth="2" />
        <g transform={`rotate(${turbineAngle} 74 95)`}>
          <line x1="74" y1="84" x2="74" y2="106" stroke="#3b82f6" strokeWidth="2" />
          <line x1="63" y1="95" x2="85" y2="95" stroke="#3b82f6" strokeWidth="2" />
        </g>
        <line x1="87" y1="95" x2="108" y2="95" stroke="#3b82f6" strokeWidth="4" />
        {/* 中冷器 */}
        <rect x="108" y="84" width="14" height="22" rx="2" fill="#bfdbfe" stroke="#3b82f6" />
        <line x1="112" y1="84" x2="112" y2="106" stroke="#3b82f6" strokeWidth="1" />
        <line x1="118" y1="84" x2="118" y2="106" stroke="#3b82f6" strokeWidth="1" />
        <line x1="122" y1="95" x2="146" y2="95" stroke="#3b82f6" strokeWidth="4" />

        {/* 发动机 */}
        <rect x="146" y="72" width="52" height="46" rx="6" fill="#fafafa" stroke="#71717a" strokeWidth="2" />
        <text x="172" y="98" textAnchor="middle" fontSize="10" fill="#71717a">发动机</text>

        {/* 排气（右）：发动机 → 涡轮 → 排出 */}
        <line x1="198" y1="95" x2="224" y2="95" stroke="#ef4444" strokeWidth="4" />
        <circle cx="234" cy="95" r="13" fill="#fecaca" stroke="#ef4444" strokeWidth="2" />
        <g transform={`rotate(${turbineAngle} 234 95)`}>
          <line x1="234" y1="84" x2="234" y2="106" stroke="#ef4444" strokeWidth="2" />
          <line x1="223" y1="95" x2="245" y2="95" stroke="#ef4444" strokeWidth="2" />
        </g>
        <line x1="247" y1="95" x2="292" y2="95" stroke="#ef4444" strokeWidth="4" />
        <path d="M 292 90 Q 296 95 292 100" fill="none" stroke="#ef4444" strokeWidth="2" />

        {/* 泄压阀指示 */}
        {blowoff && (
          <text x="150" y="30" textAnchor="middle" fontSize="13" fontWeight="700" fill="#8b5cf6">
            {t("turboBlowoff")}
          </text>
        )}

        {/* 增压值表：左侧竖条 */}
        <rect x="22" y="30" width="14" height="120" rx="3" fill="none" stroke="#a1a1aa" strokeWidth="1.5" />
        <rect
          x="24"
          y={150 - boost * 60}
          width="10"
          height={boost * 60}
          rx="2"
          fill={boost > 1.3 ? "#ef4444" : boost > 0.6 ? "#f59e0b" : "#16a34a"}
        />
        <text x="29" y="166" textAnchor="middle" fontSize="9" fill="#a1a1aa">0</text>
        <text x="29" y="36" textAnchor="middle" fontSize="9" fill="#a1a1aa">2.0</text>
        <text x="29" y="20" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">
          {boost.toFixed(2)} bar
        </text>
      </svg>

      <label className="flex w-full max-w-xs items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t("turboThrottle")}
        <input type="range" min={0} max={100} value={throttle} onChange={(e) => setThrottle(Number(e.target.value))} className={sliderCls} />
        <span className="w-14 text-right tabular-nums">{throttle}%</span>
      </label>
      <label className="flex w-full max-w-xs items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t("turboRpm")}
        <input type="range" min={800} max={6500} step={100} value={rpm} onChange={(e) => setRpm(Number(e.target.value))} className={sliderCls} />
        <span className="w-20 text-right tabular-nums">{rpm} rpm</span>
      </label>

      <div className="grid w-full max-w-xs grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-zinc-100 px-3 py-2 text-center dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">{t("turboTurbine")}</p>
          <p className="font-bold tabular-nums">{turbineRpm.toLocaleString()} rpm</p>
        </div>
        <div className="rounded-lg bg-zinc-100 px-3 py-2 text-center dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">{t("turboPower")}</p>
          <p className="font-bold tabular-nums">{power} hp</p>
        </div>
      </div>
      <p className="max-w-sm text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400">{t("turboLag")}</p>
    </div>
  );
}

/* ---------------- 空气动力学模拟 ---------------- */

const AERO_PRESETS = {
  sedan: { cd: 0.25, area: 2.2 },
  suv: { cd: 0.35, area: 2.8 },
  truck: { cd: 0.6, area: 7.0 },
} as const;

const CAR_PROFILES = {
  sedan: "M 30 130 L 60 130 Q 66 126 72 118 L 120 118 Q 150 118 175 104 Q 200 92 232 90 Q 256 89 268 96 Q 276 102 276 112 L 276 130 Z",
  suv: "M 30 130 L 56 130 Q 62 126 66 118 L 96 118 L 110 96 L 220 96 Q 258 96 268 102 Q 276 108 276 118 L 276 130 Z",
  truck: "M 20 130 L 44 130 L 48 96 L 214 96 L 224 104 L 258 104 Q 276 104 276 116 L 276 130 Z",
} as const;

function AeroSim({ t }: { t: CarsT }) {
  const [speed, setSpeed] = useState(120); // km/h
  const [preset, setPreset] = useState<keyof typeof AERO_PRESETS>("sedan");
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number | null>(null);

  // 气流线动画
  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      setOffset((o) => (o - speed * dt * 1.2 + 14) % 14);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speed]);

  const { cd, area } = AERO_PRESETS[preset];
  const v = speed / 3.6; // m/s
  const dragN = 0.5 * 1.225 * cd * area * v * v;
  const powerKw = (dragN * v) / 1000;
  const powerHp = powerKw / 0.735;

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        {t("aeroHint")}
      </p>
      <svg viewBox="0 0 300 150" className="w-full max-w-xs" role="img">
        {/* 气流线（4 条虚线，速度越快流动越快） */}
        {[38, 55, 72, 108].map((y) => (
          <line
            key={y}
            x1="6"
            y1={y}
            x2="294"
            y2={y}
            stroke="#60a5fa"
            strokeWidth="1.5"
            strokeDasharray="7 7"
            strokeDashoffset={-offset}
            opacity={0.6}
          />
        ))}
        {/* 车身轮廓 */}
        <path d={CAR_PROFILES[preset]} fill="#6366f1" opacity="0.85" />
        {/* 车轮 */}
        <circle cx="96" cy="132" r="12" fill="#27272a" />
        <circle cx="226" cy="132" r="12" fill="#27272a" />
      </svg>

      <div className="flex flex-wrap justify-center gap-2">
        {(
          [
            { key: "sedan", label: t("aeroSedan") },
            { key: "suv", label: t("aeroSuv") },
            { key: "truck", label: t("aeroTruck") },
          ] as { key: keyof typeof AERO_PRESETS; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setPreset(key)}
            className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
              preset === key
                ? "bg-indigo-600 text-white"
                : "border border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            {label}（Cd {AERO_PRESETS[key].cd}）
          </button>
        ))}
      </div>

      <label className="flex w-full max-w-xs items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t("aeroSpeed")}
        <input
          type="range"
          min={0}
          max={300}
          step={10}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="flex-1 accent-indigo-600"
        />
        <span className="w-20 text-right tabular-nums">{speed} km/h</span>
      </label>

      <div className="grid w-full max-w-xs grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-zinc-100 px-3 py-2 text-center dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">{t("aeroDrag")}</p>
          <p className="font-bold tabular-nums">{dragN.toFixed(0)} N</p>
        </div>
        <div className="rounded-lg bg-zinc-100 px-3 py-2 text-center dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">{t("aeroPower")}</p>
          <p className="font-bold tabular-nums">
            {powerKw.toFixed(1)} kW ≈ {powerHp.toFixed(0)} hp
          </p>
        </div>
      </div>
      <p className="max-w-sm text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400">{t("aeroNote")}</p>
    </div>
  );
}

/* ---------------- 刹车距离模拟 ---------------- */

const ROAD_MU = { dry: 0.9, wet: 0.55, snow: 0.2 } as const;
const ROAD_COLORS = { dry: "#71717a", wet: "#0ea5e9", snow: "#e2e8f0" } as const;
const REACTION_TIME = 0.7;

function BrakeSim({ t }: { t: CarsT }) {
  const [v0, setV0] = useState(100); // km/h 初速度
  const [road, setRoad] = useState<keyof typeof ROAD_MU>("dry");
  const [speed, setSpeed] = useState(100); // 当前速度 km/h
  const [braking, setBraking] = useState(false);
  const [wheelAngle, setWheelAngle] = useState(0);
  const rafRef = useRef<number | null>(null);
  const speedRef = useRef(100);

  const mu = ROAD_MU[road];
  const decel = mu * 9.81; // m/s²
  const reactionM = (v0 / 3.6) * REACTION_TIME;
  const brakingM = (v0 / 3.6) ** 2 / (2 * decel);
  const totalM = reactionM + brakingM;

  function brake() {
    if (braking || speedRef.current <= 0) return;
    setBraking(true);
    setSpeed(v0);
    speedRef.current = v0;
  }

  function reset() {
    setBraking(false);
    setSpeed(v0);
    speedRef.current = v0;
  }

  useEffect(() => {
    if (!braking) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      speedRef.current = Math.max(0, speedRef.current - decel * 3.6 * dt);
      setSpeed(speedRef.current);
      setWheelAngle((a) => (a + (speedRef.current / 3.6) * dt * 60) % 360);
      if (speedRef.current <= 0) setBraking(false);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [braking, decel]);

  // 距离可视化比例
  const scale = Math.max(1, totalM);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("brakeHint")}</p>

      <svg viewBox="0 0 300 130" className="w-full max-w-xs self-center" role="img">
        {/* 路面（按路况着色） */}
        <rect x="6" y="104" width="288" height="20" rx="4" fill={ROAD_COLORS[road]} opacity="0.5" />
        {/* 车轮 + 刹车盘 + 卡钳 */}
        <g transform={`rotate(${wheelAngle} 150 92)`}>
          <circle cx="150" cy="92" r="30" fill="none" stroke="#27272a" strokeWidth="7" />
          <line x1="150" y1="64" x2="150" y2="120" stroke="#71717a" strokeWidth="2" />
          <line x1="122" y1="92" x2="178" y2="92" stroke="#71717a" strokeWidth="2" />
        </g>
        {/* 刹车盘 */}
        <circle cx="150" cy="92" r="16" fill={braking && speed > 20 ? "#f87171" : "#a1a1aa"} opacity={braking ? 0.9 : 0.6} />
        {/* 卡钳：刹车时夹紧 */}
        <g transform={`translate(0 ${braking ? 3 : 0})`}>
          <rect x="136" y="70" width="28" height="8" rx="3" fill="#ef4444" />
          <rect x="136" y="106" width="28" height="8" rx="3" fill="#ef4444" />
        </g>
        {/* 车速读数 */}
        <text x="240" y="50" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor">
          {Math.round(speed)}
        </text>
        <text x="240" y="66" textAnchor="middle" fontSize="10" fill="currentColor" className="text-zinc-400">
          km/h
        </text>
      </svg>

      <div className="flex flex-wrap justify-center gap-2">
        {(
          [
            { key: "dry", label: t("brakeDry") },
            { key: "wet", label: t("brakeWet") },
            { key: "snow", label: t("brakeSnow") },
          ] as { key: keyof typeof ROAD_MU; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setRoad(key);
              reset();
            }}
            className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
              road === key
                ? "bg-indigo-600 text-white"
                : "border border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t("brakeSpeed")}
        <input
          type="range"
          min={30}
          max={200}
          step={5}
          value={v0}
          onChange={(e) => {
            setV0(Number(e.target.value));
            reset();
          }}
          className="flex-1 accent-indigo-600"
        />
        <span className="w-20 text-right tabular-nums">{v0} km/h</span>
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={brake}
          className="flex-1 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-500"
        >
          🛑 {t("brakeStart")}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:border-zinc-400 dark:border-zinc-700"
        >
          {t("brakeReset")}
        </button>
      </div>

      {/* 距离可视化：反应距离 + 制动距离 */}
      <div>
        <div className="flex h-4 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
          <div className="h-full bg-amber-400" style={{ width: `${(reactionM / scale) * 100}%` }} />
          <div className="h-full bg-rose-500" style={{ width: `${(brakingM / scale) * 100}%` }} />
        </div>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
          <span>🟡 {t("brakeReaction")}：{reactionM.toFixed(1)} m</span>
          <span>🔴 {t("brakeBraking")}：{brakingM.toFixed(1)} m</span>
          <span className="font-semibold">📏 {t("brakeTotal")}：{totalM.toFixed(1)} m</span>
        </div>
      </div>

      <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        {t("brakeDecel")}：{(decel / 9.81).toFixed(2)} g（μ = {mu}）
      </p>
      <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">{t("brakeNote")}</p>
    </div>
  );
}

/* ---------------- 功率扭矩曲线（马力机） ---------------- */

function DynoSim({ t }: { t: CarsT }) {
  const [mode, setMode] = useState<"na" | "turbo">("na");

  // 扭矩曲线（N·m）：NA 山峰形，涡轮高原形
  function torqueAt(rpm: number, m: "na" | "turbo") {
    if (m === "na") return 200 * Math.exp(-(((rpm - 4500) / 2600) ** 2));
    if (rpm < 1500) return 250 * (rpm / 1500);
    if (rpm <= 4500) return 250;
    return 250 - ((rpm - 4500) / 2500) * 50;
  }

  // 功率 kW = 扭矩 × 转速 / 9549
  const powerAt = (rpm: number, m: "na" | "turbo") => (torqueAt(rpm, m) * rpm) / 9549;

  const torqueMax = mode === "na" ? 200 : 250;
  const maxT = torqueMax;
  const maxP = (() => {
    let best = 0;
    for (let rpm = 1000; rpm <= 7000; rpm += 50) best = Math.max(best, powerAt(rpm, mode));
    return best;
  })();
  const maxHp = maxP * 1.341;

  // 生成曲线路径（归一化到各自最大值）
  const CHART_X = (rpm: number) => 44 + ((rpm - 1000) / 6000) * 212;
  const CHART_Y = (ratio: number) => 158 - ratio * 130;
  const torquePath: string[] = [];
  const powerPath: string[] = [];
  for (let rpm = 1000; rpm <= 7000; rpm += 50) {
    torquePath.push(`${CHART_X(rpm)},${CHART_Y(torqueAt(rpm, mode) / maxT)}`);
    powerPath.push(`${CHART_X(rpm)},${CHART_Y(powerAt(rpm, mode) / maxP)}`);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        {t("dynoHint")}
      </p>
      <svg viewBox="0 0 300 190" className="w-full max-w-xs" role="img">
        {/* 网格与轴 */}
        {[0, 0.25, 0.5, 0.75, 1].map((r) => (
          <line key={r} x1="44" y1={CHART_Y(r)} x2="256" y2={CHART_Y(r)} stroke="currentColor" strokeWidth="0.5" className="text-zinc-200 dark:text-zinc-800" />
        ))}
        <line x1="44" y1="158" x2="256" y2="158" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400 dark:text-zinc-600" />
        {[2000, 3500, 5000, 6500].map((rpm) => (
          <text key={rpm} x={CHART_X(rpm)} y="176" textAnchor="middle" fontSize="9" fill="currentColor" className="text-zinc-400">
            {rpm}
          </text>
        ))}
        <text x="150" y="186" textAnchor="middle" fontSize="9" fill="currentColor" className="text-zinc-400">
          rpm
        </text>
        {/* 曲线 */}
        <polyline points={torquePath.join(" ")} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
        <polyline points={powerPath.join(" ")} fill="none" stroke="#6366f1" strokeWidth="2.5" />
        {/* 图例 */}
        <line x1="60" y1="22" x2="80" y2="22" stroke="#f59e0b" strokeWidth="2.5" />
        <text x="86" y="26" fontSize="10" fill="#f59e0b">扭矩</text>
        <line x1="140" y1="22" x2="160" y2="22" stroke="#6366f1" strokeWidth="2.5" />
        <text x="166" y="26" fontSize="10" fill="#6366f1">功率</text>
      </svg>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("na")}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            mode === "na"
              ? "bg-indigo-600 text-white"
              : "border border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
          }`}
        >
          {t("dynoNa")}
        </button>
        <button
          type="button"
          onClick={() => setMode("turbo")}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            mode === "turbo"
              ? "bg-indigo-600 text-white"
              : "border border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
          }`}
        >
          {t("dynoTurbo")}
        </button>
      </div>

      <div className="grid w-full max-w-xs grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-zinc-100 px-3 py-2 text-center dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">{t("dynoMaxPower")}</p>
          <p className="font-bold tabular-nums">{maxHp.toFixed(0)} hp</p>
        </div>
        <div className="rounded-lg bg-zinc-100 px-3 py-2 text-center dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">{t("dynoMaxTorque")}</p>
          <p className="font-bold tabular-nums">{torqueMax} N·m</p>
        </div>
      </div>
      <p className="max-w-sm text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400">{t("dynoNote")}</p>
    </div>
  );
}

/* ---------------- 转向模拟 ---------------- */

const WHEELBASE_M = 2.7;

function SteeringSim({ t }: { t: CarsT }) {
  const [steeringDeg, setSteeringDeg] = useState(90); // 方向盘转角
  const [speed, setSpeed] = useState(40); // km/h

  // 转向比 15:1，前轮转角上限 ±35°
  const wheelDeg = Math.max(-35, Math.min(35, steeringDeg / 15));
  const rad = (wheelDeg * Math.PI) / 180;
  const straight = Math.abs(wheelDeg) < 0.5;
  const radiusM = straight ? Infinity : WHEELBASE_M / Math.tan(rad);
  const v = speed / 3.6;
  const lateralG = straight ? 0 : (v * v) / (radiusM * 9.81);

  const arcR = Math.max(30, Math.min(130, Math.abs(radiusM) * 1.6));
  const arcPath =
    wheelDeg > 0
      ? `M ${150 + arcR} 80 A ${arcR} ${arcR} 0 0 1 150 ${80 + arcR}`
      : `M ${150 - arcR} 80 A ${arcR} ${arcR} 0 0 0 150 ${80 - arcR}`;

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        {t("steeringHint")}
      </p>
      <svg viewBox="0 0 300 190" className="w-full max-w-xs" role="img">
        {/* 转弯半径虚线弧 */}
        {!straight && (
          <path d={arcPath} fill="none" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.7" />
        )}
        {/* 车身（俯视） */}
        <rect x="55" y="48" width="190" height="74" rx="20" fill="#6366f1" opacity="0.9" />
        <rect x="86" y="58" width="44" height="22" rx="4" fill="#e4e4e7" opacity="0.7" />
        <rect x="170" y="58" width="44" height="22" rx="4" fill="#e4e4e7" opacity="0.7" />
        {/* 前轮（可转向） */}
        <g transform={`rotate(${-wheelDeg} 82 44)`}>
          <rect x="72" y="38" width="20" height="12" rx="3" fill="#27272a" />
        </g>
        <g transform={`rotate(${-wheelDeg} 218 44)`}>
          <rect x="208" y="38" width="20" height="12" rx="3" fill="#27272a" />
        </g>
        {/* 后轮（固定） */}
        <rect x="72" y="122" width="20" height="12" rx="3" fill="#27272a" />
        <rect x="208" y="122" width="20" height="12" rx="3" fill="#27272a" />
        {/* 方向盘 */}
        <g transform={`rotate(${steeringDeg * 0.6} 262 150)`}>
          <circle cx="262" cy="150" r="22" fill="none" stroke="#71717a" strokeWidth="5" />
          <line x1="262" y1="132" x2="262" y2="168" stroke="#71717a" strokeWidth="3" />
        </g>
        <text x="262" y="184" textAnchor="middle" fontSize="9" fill="currentColor" className="text-zinc-400">
          {t("steeringWheel")}
        </text>
      </svg>

      <label className="flex w-full max-w-xs items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t("steeringWheel")}
        <input
          type="range"
          min={-200}
          max={200}
          value={steeringDeg}
          onChange={(e) => setSteeringDeg(Number(e.target.value))}
          className="flex-1 accent-indigo-600"
        />
        <span className="w-16 text-right tabular-nums">{steeringDeg}°</span>
      </label>
      <label className="flex w-full max-w-xs items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t("steeringSpeed")}
        <input
          type="range"
          min={10}
          max={120}
          step={5}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="flex-1 accent-indigo-600"
        />
        <span className="w-20 text-right tabular-nums">{speed} km/h</span>
      </label>

      <div className="grid w-full max-w-xs grid-cols-3 gap-2 text-sm">
        <div className="rounded-lg bg-zinc-100 px-2 py-2 text-center dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">{t("wheelAngle")}</p>
          <p className="font-bold tabular-nums">{wheelDeg.toFixed(1)}°</p>
        </div>
        <div className="rounded-lg bg-zinc-100 px-2 py-2 text-center dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">{t("turnRadius")}</p>
          <p className="font-bold tabular-nums">
            {straight ? "∞" : `${Math.abs(radiusM).toFixed(1)} m`}
          </p>
        </div>
        <div className="rounded-lg bg-zinc-100 px-2 py-2 text-center dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">{t("lateralG")}</p>
          <p
            className={`font-bold tabular-nums ${
              lateralG > 0.8 ? "text-rose-600" : lateralG > 0.4 ? "text-amber-600" : ""
            }`}
          >
            {lateralG.toFixed(2)} g
          </p>
        </div>
      </div>
      <p className="max-w-sm text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400">{t("steeringNote")}</p>
    </div>
  );
}

/* ---------------- 四驱扭矩分配模拟 ---------------- */

const AWD_MU = { dry: 0.9, wet: 0.55, snow: 0.2 } as const;
type AwdMode = "fwd" | "rwd" | "awd" | "onDemand";

function AwdSim({ t }: { t: CarsT }) {
  const [mode, setMode] = useState<AwdMode>("fwd");
  const [road, setRoad] = useState<keyof typeof AWD_MU>("dry");
  const [throttle, setThrottle] = useState(100);

  const mu = AWD_MU[road];

  // 重心后移：油门越大，前轮负载越少
  const frontLoad = 0.55 - 0.18 * (throttle / 100);
  const rearLoad = 1 - frontLoad;

  // 扭矩分配
  let frontShare: number;
  let rearShare: number;
  if (mode === "fwd") [frontShare, rearShare] = [1, 0];
  else if (mode === "rwd") [frontShare, rearShare] = [0, 1];
  else if (mode === "awd") [frontShare, rearShare] = [0.5, 0.5];
  else {
    // 适时四驱：默认前驱；前轮抓不住时转移 55% 到后轴
    const frontGrip = mu * frontLoad * 100;
    const slipFront = throttle * 1 > frontGrip;
    [frontShare, rearShare] = slipFront ? [0.45, 0.55] : [1, 0];
  }

  // 打滑判定：该轴所需扭矩 > 抓地极限
  const gripLimit = (load: number) => mu * load * 100;
  const slipFront = throttle * frontShare > gripLimit(frontLoad);
  const slipRear = throttle * rearShare > gripLimit(rearLoad);

  const wheel = (share: number, slip: boolean, y: number, x: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x - 9} y={y - 6} width="18" height="12" rx="3" fill="#27272a" />
      {slip && <circle cx={x} cy={y} r="14" fill="#ef4444" opacity="0.35" />}
      {/* 扭矩条 */}
      <rect x={x - 4} y={y + 12} width="8" height="22" rx="2" fill="#e4e4e7" />
      <rect
        x={x - 4}
        y={y + 12 + 22 - share * 22}
        width="8"
        height={share * 22}
        rx="2"
        fill={slip ? "#ef4444" : "#6366f1"}
      />
    </g>
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("awdHint")}</p>

      <svg viewBox="0 0 300 160" className="w-full max-w-xs self-center" role="img">
        {/* 车身（俯视） */}
        <rect x="70" y="52" width="160" height="70" rx="18" fill="#6366f1" opacity="0.85" />
        <line x1="150" y1="52" x2="150" y2="122" stroke="#fff" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
        {/* 四轮 + 扭矩条 */}
        {wheel(frontShare / 2, slipFront, 44, 95)}
        {wheel(frontShare / 2, slipFront, 44, 205)}
        {wheel(rearShare / 2, slipRear, 132, 95)}
        {wheel(rearShare / 2, slipRear, 132, 205)}
        <text x="60" y="48" fontSize="9" fill="currentColor" className="text-zinc-400">前轴</text>
        <text x="60" y="140" fontSize="9" fill="currentColor" className="text-zinc-400">后轴</text>
      </svg>

      <div className="flex flex-wrap justify-center gap-2">
        {(
          [
            { key: "fwd", label: t("awdFwd") },
            { key: "rwd", label: t("awdRwd") },
            { key: "awd", label: t("awdFull") },
            { key: "onDemand", label: t("awdOnDemand") },
          ] as { key: AwdMode; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              mode === key
                ? "bg-indigo-600 text-white"
                : "border border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {(
          [
            { key: "dry", label: `${t("brakeDry")} μ0.9` },
            { key: "wet", label: `${t("brakeWet")} μ0.55` },
            { key: "snow", label: `${t("brakeSnow")} μ0.2` },
          ] as { key: keyof typeof AWD_MU; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setRoad(key)}
            className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
              road === key
                ? "bg-zinc-600 text-white"
                : "border border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t("awdThrottle")}
        <input
          type="range"
          min={0}
          max={100}
          value={throttle}
          onChange={(e) => setThrottle(Number(e.target.value))}
          className="flex-1 accent-indigo-600"
        />
        <span className="w-14 text-right tabular-nums">{throttle}%</span>
      </label>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">{t("awdTorque")}：前/后</p>
          <p className="font-bold tabular-nums">
            {Math.round(frontShare * 100)}% / {Math.round(rearShare * 100)}%
          </p>
        </div>
        <div className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">抓地极限：前/后</p>
          <p className="font-bold tabular-nums">
            {Math.round(gripLimit(frontLoad))} / {Math.round(gripLimit(rearLoad))}
          </p>
        </div>
      </div>

      {(slipFront || slipRear) && (
        <p className="text-center text-sm font-bold text-rose-600 dark:text-rose-400">
          ⚠️ {t("awdSlip")}（{slipFront ? "前轮" : ""}{slipFront && slipRear ? " + " : ""}{slipRear ? "后轮" : ""}）
        </p>
      )}

      <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">{t("awdNote")}</p>
    </div>
  );
}

/* ---------------- 碰撞测试模拟 ---------------- */

const CAR_MASS_KG = 1500;
const CRUSH_DISTANCE_M = 0.6;

function CrashSim({ t }: { t: CarsT }) {
  const [speed, setSpeed] = useState(60); // km/h
  const [phase, setPhase] = useState<"ready" | "crashing" | "done">("ready");
  const [x, setX] = useState(0); // 车辆平移
  const [squash, setSquash] = useState(1);
  const rafRef = useRef<number | null>(null);

  const v = speed / 3.6;
  const energyJ = 0.5 * CAR_MASS_KG * v * v;
  const energyKJ = energyJ / 1000;
  const tntG = energyJ / 4184;
  const decel = (v * v) / (2 * CRUSH_DISTANCE_M);
  const gForce = decel / 9.81;
  const surviveLevel = gForce < 15 ? 1 : gForce < 35 ? 2 : 3;

  function crash() {
    if (phase !== "ready") return;
    setPhase("crashing");
    const start = performance.now();
    const tick = (now: number) => {
      const tMs = now - start;
      if (tMs < 700) {
        const p = tMs / 700;
        setX(p * 168); // 从起点滑向墙壁
        rafRef.current = requestAnimationFrame(tick);
      } else if (tMs < 950) {
        const p = (tMs - 700) / 250;
        setSquash(1 - p * 0.48); // 车头压溃
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPhase("done");
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  function reset() {
    setPhase("ready");
    setX(0);
    setSquash(1);
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const surviveText =
    surviveLevel === 1 ? t("crashSurvive1") : surviveLevel === 2 ? t("crashSurvive2") : t("crashSurvive3");
  const surviveColor =
    surviveLevel === 1
      ? "text-emerald-600 dark:text-emerald-400"
      : surviveLevel === 2
        ? "text-amber-600 dark:text-amber-400"
        : "text-rose-600 dark:text-rose-400";

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        {t("crashHint")}
      </p>
      <svg viewBox="0 0 300 140" className="w-full max-w-xs" role="img">
        {/* 地面 */}
        <line x1="8" y1="112" x2="292" y2="112" stroke="currentColor" strokeWidth="2" className="text-zinc-400 dark:text-zinc-600" />
        {/* 墙 */}
        <rect x="268" y="22" width="10" height="90" rx="2" fill="#71717a" />
        <text x="273" y="14" textAnchor="middle" fontSize="9" fill="#71717a">墙</text>
        {/* 车辆（侧视）：车头向右，压溃时以车头为轴压缩 */}
        <g
          style={{
            transform: `translate(${x}px, 0px) scale(${squash}, 1)`,
            transformBox: "fill-box",
            transformOrigin: "right center",
          }}
        >
          <path d="M 28 94 L 52 94 Q 58 90 62 80 L 100 80 Q 116 80 124 70 Q 138 56 162 56 Q 190 56 200 66 Q 208 74 208 84 L 208 94 Z" fill="#6366f1" />
          <circle cx="72" cy="98" r="12" fill="#27272a" />
          <circle cx="172" cy="98" r="12" fill="#27272a" />
          <rect x="96" y="62" width="34" height="14" rx="3" fill="#c7d2fe" opacity="0.9" />
        </g>
        {/* 速度线 */}
        {phase === "crashing" && x < 160 && (
          <>
            <line x1={x + 10} y1="40" x2={x + 34} y2="40" stroke="#60a5fa" strokeWidth="1.5" opacity="0.7" />
            <line x1={x + 2} y1="66" x2={x + 30} y2="66" stroke="#60a5fa" strokeWidth="1.5" opacity="0.7" />
          </>
        )}
      </svg>

      <label className="flex w-full max-w-xs items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t("crashSpeed")}
        <input
          type="range"
          min={20}
          max={120}
          step={5}
          value={speed}
          onChange={(e) => {
            setSpeed(Number(e.target.value));
            reset();
          }}
          className="flex-1 accent-indigo-600"
        />
        <span className="w-20 text-right tabular-nums">{speed} km/h</span>
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={crash}
          className="rounded-lg bg-rose-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-500"
        >
          💥 {t("crashImpact")}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:border-zinc-400 dark:border-zinc-700"
        >
          {t("crashReset")}
        </button>
      </div>

      {phase === "done" && (
        <div className="grid w-full max-w-xs grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-zinc-100 px-3 py-2 text-center dark:bg-zinc-900">
            <p className="text-xs text-zinc-500">{t("crashEnergy")}</p>
            <p className="font-bold tabular-nums">{energyKJ.toFixed(0)} kJ</p>
            <p className="text-xs text-zinc-400">
              {t("crashTnt")} {tntG.toFixed(0)} g
            </p>
          </div>
          <div className="rounded-lg bg-zinc-100 px-3 py-2 text-center dark:bg-zinc-900">
            <p className="text-xs text-zinc-500">{t("crashG")}</p>
            <p className="font-bold tabular-nums">{gForce.toFixed(0)} g</p>
          </div>
          <div className="col-span-2 rounded-lg bg-zinc-100 px-3 py-2 text-center dark:bg-zinc-900">
            <p className="text-xs text-zinc-500">{t("crashSurvive")}</p>
            <p className={`font-semibold ${surviveColor}`}>{surviveText}</p>
          </div>
        </div>
      )}

      <p className="max-w-sm text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400">{t("crashNote")}</p>
    </div>
  );
}
