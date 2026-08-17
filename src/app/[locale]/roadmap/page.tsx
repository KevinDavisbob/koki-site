import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing, toLocale } from "@/i18n/routing";
import { getRoadmap } from "@/lib/roadmaps";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/roadmap">): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = toLocale(locale) ?? routing.defaultLocale;
  const t = await getTranslations({ locale: validLocale, namespace: "Roadmap" });
  return { title: t("title"), description: t("description") };
}

export default async function RoadmapPage({
  params,
}: PageProps<"/[locale]/roadmap">) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  if (!locale) notFound();
  await setRequestLocale(locale);

  const t = await getTranslations("Roadmap");
  const { tracks, tips } = getRoadmap(locale);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">{t("description")}</p>
      <p className="mt-4 text-sm">
        <Link
          href="/resources"
          className="text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400"
        >
          {t("resourcesLink")}
        </Link>
      </p>

      {/* 页内快速导航 */}
      <nav className="mt-8 flex flex-wrap gap-2">
        {tracks.map((track) => (
          <a
            key={track.key}
            href={`#${track.key}`}
            className="rounded-full border border-zinc-200 px-3.5 py-1.5 text-sm text-zinc-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
          >
            {track.title}
          </a>
        ))}
        <a
          href="#tips"
          className="rounded-full border border-zinc-200 px-3.5 py-1.5 text-sm text-zinc-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
        >
          💡 Tips
        </a>
      </nav>

      {/* 路线轨道 */}
      <div className="mt-12 flex flex-col gap-16">
        {tracks.map((track) => (
          <section key={track.key} id={track.key} className="scroll-mt-20">
            <h2 className="text-xl font-semibold tracking-tight">{track.title}</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {track.goal}
            </p>

            <ol className="mt-6 space-y-0">
              {track.steps.map((step, index) => (
                <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
                  {/* 时间线 */}
                  {index < track.steps.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-[15px] top-8 h-full w-px bg-zinc-200 dark:bg-zinc-800"
                    />
                  )}
                  <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
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
        ))}

        {/* 通用建议 */}
        <section id="tips" className="scroll-mt-20">
          <h2 className="text-xl font-semibold tracking-tight">
            💡 {t("roadmapTips")}
          </h2>
          <ul className="mt-5 space-y-3">
            {tips.map((tip) => (
              <li
                key={tip}
                className="rounded-lg border border-zinc-200 px-4 py-3 text-sm leading-6 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
              >
                {tip}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
