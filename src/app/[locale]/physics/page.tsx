import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, toLocale } from "@/i18n/routing";
import { getPhysicsContent } from "@/lib/physics";
import { MotorSims } from "@/components/motor-sims";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/physics">): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = toLocale(locale) ?? routing.defaultLocale;
  const t = await getTranslations({ locale: validLocale, namespace: "Physics" });
  return { title: t("title"), description: t("description") };
}

export default async function PhysicsPage({
  params,
}: PageProps<"/[locale]/physics">) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  if (!locale) notFound();
  await setRequestLocale(locale);

  const t = await getTranslations("Physics");
  const { intro, topics, brands, terms } = getPhysicsContent(locale);

  return (
    <div>
      {/* 头图区 */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            ⚡ {t("title")}
          </h1>
          <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">{intro}</p>
        </div>
      </div>

      {/* 专区独立子导航栏 */}
      <nav className="sticky top-16 z-30 border-b border-zinc-200/80 bg-background/80 backdrop-blur-md dark:border-zinc-800">
        <div className="mx-auto flex w-full max-w-3xl gap-2 overflow-x-auto px-6 py-3">
          {[
            { href: "#knowledge", icon: "📖", label: t("navKnowledge") },
            { href: "#sims", icon: "🎮", label: t("navSims") },
            { href: "#brands", icon: "🏢", label: t("navBrands") },
            { href: "#terms", icon: "📇", label: t("navTerms") },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-zinc-200 px-4 py-1.5 text-sm text-zinc-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
            >
              {item.icon} {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto w-full max-w-3xl px-6 pb-24">
        {/* 知识 */}
        <section id="knowledge" className="scroll-mt-36 pt-12">
          <h2 className="text-xl font-semibold tracking-tight">📖 {t("navKnowledge")}</h2>
          <div className="mt-6 flex flex-col gap-10">
            {topics.map((topic) => (
              <article
                key={topic.key}
                className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
              >
                <h3 className="text-lg font-semibold tracking-tight">
                  {topic.icon} {topic.title}
                </h3>
                <div className="mt-4 flex flex-col gap-3">
                  {topic.paragraphs.map((paragraph, i) => (
                    <p
                      key={i}
                      className="leading-8 text-zinc-700 dark:text-zinc-300"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                <ul className="mt-4 flex flex-col gap-2 rounded-lg bg-indigo-50/60 p-4 dark:bg-indigo-950/30">
                  {topic.points.map((point) => (
                    <li
                      key={point}
                      className="text-sm leading-6 text-zinc-600 dark:text-zinc-300"
                    >
                      <span className="mr-1.5 text-indigo-500">▸</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* 模拟器 */}
        <section id="sims" className="scroll-mt-36 pt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold tracking-tight">🎮 {t("simsTitle")}</h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">{t("simsNote")}</p>
          </div>
          <div className="mt-5">
            <MotorSims />
          </div>
        </section>

        {/* 品牌 */}
        <section id="brands" className="scroll-mt-36 pt-16">
          <h2 className="text-xl font-semibold tracking-tight">🏢 {t("brandsTitle")}</h2>
          <div className="mt-6 grid gap-4">
            {brands.map((brand) => (
              <article
                key={brand.name}
                className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl">{brand.icon}</span>
                  <h3 className="text-lg font-semibold tracking-tight">{brand.name}</h3>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {brand.origin}
                  </span>
                </div>
                <p className="mt-3 leading-7 text-zinc-700 dark:text-zinc-300">
                  {brand.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {brand.strengths.map((strength) => (
                    <span
                      key={strength}
                      className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 术语表 */}
        <section id="terms" className="scroll-mt-36 pt-16">
          <h2 className="text-xl font-semibold tracking-tight">📇 {t("navTerms")}</h2>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {terms.map((term) => (
              <div
                key={term.term}
                className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <dt className="font-semibold">{term.term}</dt>
                <dd className="mt-1.5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {term.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
