import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing, toLocale } from "@/i18n/routing";
import { getSecurityContent } from "@/lib/security";
import { CipherTools } from "@/components/cipher-tools";

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
  const { intro, challengeLink, roadmap, platforms, ethics } =
    getSecurityContent(locale);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        🛡️ {t("title")}
      </h1>
      <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">{intro}</p>

      {/* CTF 挑战入口 */}
      <Link
        href="/challenge"
        className="mt-6 flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50/60 px-5 py-4 text-sm font-medium text-indigo-700 transition-colors hover:border-indigo-300 hover:bg-indigo-100/60 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-950/60"
      >
        {challengeLink}
      </Link>

      {/* 学习路线 */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight">{t("roadmapTitle")}</h2>
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

      {/* 实战平台 */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight">{t("platformsTitle")}</h2>
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

      {/* 密码学小工具 */}
      <section className="mt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-semibold tracking-tight">{t("toolsTitle")}</h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">{t("toolsNote")}</p>
        </div>
        <div className="mt-5">
          <CipherTools />
        </div>
      </section>
    </div>
  );
}
