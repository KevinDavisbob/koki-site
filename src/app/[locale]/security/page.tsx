import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing, toLocale } from "@/i18n/routing";
import { getSecurityContent } from "@/lib/security";
import { CipherTools } from "@/components/cipher-tools";
import { SqlInjectionDemo } from "@/components/sql-injection-demo";
import { XssLab } from "@/components/xss-lab";
import { StudyChecklist } from "@/components/study-checklist";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/security">): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = toLocale(locale) ?? routing.defaultLocale;
  const t = await getTranslations({ locale: validLocale, namespace: "Security" });
  return { title: t("title"), description: t("description") };
}

export default async function SecurityPage({
  params,
}: PageProps<"/[locale]/security">) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  if (!locale) notFound();
  await setRequestLocale(locale);

  const t = await getTranslations("Security");
  const {
    intro,
    challengeLink,
    stages,
    roadmap,
    vulns,
    platforms,
    tools,
    cheats,
    ethics,
  } = getSecurityContent(locale);

  return (
    <div>
      {/* 头图区 */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            🛡️ {t("title")}
          </h1>
          <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">{intro}</p>
          <Link
            href="/challenge"
            className="mt-6 flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50/60 px-5 py-4 text-sm font-medium text-indigo-700 transition-colors hover:border-indigo-300 hover:bg-indigo-100/60 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-950/60"
          >
            {challengeLink}
          </Link>
        </div>
      </div>

      {/* 专区独立子导航栏 */}
      <nav className="sticky top-16 z-30 border-b border-zinc-200/80 bg-background/80 backdrop-blur-md dark:border-zinc-800">
        <div className="mx-auto flex w-full max-w-3xl gap-2 overflow-x-auto px-6 py-3">
          {[
            { href: "#guide", icon: "📍", label: t("guideTitle").replace("：从入门到入土", "") },
            { href: "#roadmap", icon: "🗺️", label: t("roadmapTitle") },
            { href: "#owasp", icon: "🛡️", label: "OWASP" },
            { href: "#labs", icon: "🧪", label: t("labTitle") },
            { href: "#tools", icon: "🔧", label: t("toolsTitle") },
            { href: "#platforms", icon: "🎯", label: t("platformsTitle") },
            { href: "#cheats", icon: "📋", label: t("cheatsTitle") },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-zinc-200 px-4 py-1.5 text-sm text-zinc-600 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
            >
              {item.icon} {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto w-full max-w-3xl px-6 pb-24">
        {/* 新手引导 */}
        <section id="guide" className="scroll-mt-36 pt-12">
          <h2 className="text-xl font-semibold tracking-tight">📍 {t("guideTitle")}</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t("guideIntro")}</p>

          <div className="mt-6">
            <StudyChecklist stages={stages} />
          </div>

          {/* 阶段详情 */}
          <div className="mt-8 flex flex-col gap-6">
            {stages.map((stage) => (
              <article
                key={stage.key}
                className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold tracking-tight">{stage.title}</h3>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    ⏱ {stage.duration}
                  </span>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
                      {t("stageLearn")}
                    </p>
                    <ul className="mt-2 flex flex-col gap-2">
                      {stage.learn.map((item) => (
                        <li
                          key={item}
                          className="text-sm leading-6 text-zinc-600 dark:text-zinc-400"
                        >
                          <span className="mr-1.5 text-indigo-400">▸</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500">
                      {t("stagePractice")}
                    </p>
                    <ul className="mt-2 flex flex-col gap-2">
                      {stage.practice.map((item) => (
                        <li
                          key={item}
                          className="text-sm leading-6 text-zinc-600 dark:text-zinc-400"
                        >
                          <span className="mr-1.5 text-emerald-400">▸</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-4 rounded-lg bg-amber-50/60 px-4 py-2.5 text-sm leading-6 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                  {t("stageMilestone")}：{stage.milestone}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 学习路线（精简时间线） */}
        <section id="roadmap" className="scroll-mt-36 pt-16">
          <h2 className="text-xl font-semibold tracking-tight">🗺️ {t("roadmapTitle")}</h2>
          <ol className="mt-6">
            {roadmap.map((step, index) => (
              <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
                {index < roadmap.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-[15px] top-8 h-full w-px bg-zinc-200 dark:bg-zinc-800"
                  />
                )}
                <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-semibold">{step.title}</h3>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {step.duration}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* OWASP Top 10 */}
        <section id="owasp" className="scroll-mt-36 pt-16">
          <h2 className="text-xl font-semibold tracking-tight">🛡️ {t("owaspTitle")}</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t("owaspIntro")}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {vulns.map((vuln, index) => (
              <div
                key={vuln.name}
                className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <h3 className="text-sm font-semibold">
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded bg-rose-100 text-xs font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                    {index + 1}
                  </span>
                  {vuln.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {vuln.what}
                </p>
                <p className="mt-2 text-xs leading-5 text-emerald-700 dark:text-emerald-400">
                  🛡️ {t("vulnDefend")}：{vuln.defend}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 动手实验 */}
        <section id="labs" className="scroll-mt-36 pt-16">
          <h2 className="text-xl font-semibold tracking-tight">🧪 {t("labTitle")}</h2>
          <div className="mt-6 flex flex-col gap-4">
            <SqlInjectionDemo />
            <XssLab />
          </div>
        </section>

        {/* 密码学小工具 */}
        <section id="tools" className="scroll-mt-36 pt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold tracking-tight">🔧 {t("toolsTitle")}</h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">{t("toolsNote")}</p>
          </div>
          <div className="mt-5">
            <CipherTools />
          </div>
        </section>

        {/* 实战平台 */}
        <section id="platforms" className="scroll-mt-36 pt-16">
          <h2 className="text-xl font-semibold tracking-tight">🎯 {t("platformsTitle")}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {platforms.map((platform) => (
              <a
                key={platform.url}
                href={platform.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-2 rounded-xl border border-zinc-200 p-5 transition-colors hover:border-emerald-300 dark:border-zinc-800 dark:hover:border-emerald-700"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {platform.title}
                  </h3>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    {platform.tag}
                  </span>
                </div>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {platform.description}
                </p>
              </a>
            ))}
          </div>
          <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
            {ethics}
          </p>
        </section>

        {/* 速查表 */}
        <section id="cheats" className="scroll-mt-36 pt-16">
          <h2 className="text-xl font-semibold tracking-tight">📋 {t("cheatsTitle")}</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t("cheatsIntro")}</p>
          <div className="mt-6 flex flex-col gap-6">
            {cheats.map((sheet) => (
              <div
                key={sheet.title}
                className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
              >
                <p className="border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-semibold dark:border-zinc-800 dark:bg-zinc-900">
                  {sheet.title}
                </p>
                <table className="w-full text-sm">
                  <tbody>
                    {sheet.rows.map((row) => (
                      <tr
                        key={row.item}
                        className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
                      >
                        <td className="px-4 py-2.5 font-mono text-xs text-indigo-600 dark:text-indigo-400">
                          {row.item}
                        </td>
                        <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">
                          {row.usage}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </section>

        {/* 工具包 */}
        <section id="toolkit" className="scroll-mt-36 pt-16">
          <h2 className="text-xl font-semibold tracking-tight">🧰 {t("toolsSection")}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {tools.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-2 rounded-xl border border-zinc-200 p-5 transition-colors hover:border-emerald-300 dark:border-zinc-800 dark:hover:border-emerald-700"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {tool.name}
                  </h3>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    {tool.category}
                  </span>
                </div>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {tool.description}
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
