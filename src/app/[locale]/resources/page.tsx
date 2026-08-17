import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, toLocale } from "@/i18n/routing";
import {
  getResourceCategories,
  type Resource,
  type ResourceType,
  type ResourceLevel,
} from "@/lib/resources";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/resources">): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = toLocale(locale) ?? routing.defaultLocale;
  const t = await getTranslations({ locale: validLocale, namespace: "Resources" });
  return { title: t("title"), description: t("description") };
}

function ResourceCard({
  resource,
  typeLabels,
  levelLabels,
}: {
  resource: Resource;
  typeLabels: Record<ResourceType, string>;
  levelLabels: Record<ResourceLevel, string>;
}) {
  const levelStyles: Record<ResourceLevel, string> = {
    beginner: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
    intermediate: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
    reference: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900",
  };

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col gap-2 rounded-xl border border-zinc-200 p-5 transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:hover:border-indigo-700"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-medium text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
          {typeLabels[resource.type]}
        </span>
        <span
          className={`rounded-full border px-2 py-0.5 ${levelStyles[resource.level]}`}
        >
          {levelLabels[resource.level]}
        </span>
        <span className="text-amber-500" aria-label="rating">
          {"★".repeat(resource.rating)}
        </span>
      </div>
      <h3 className="font-semibold transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
        {resource.title}
      </h3>
      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {resource.description}
      </p>
    </a>
  );
}

export default async function ResourcesPage({
  params,
}: PageProps<"/[locale]/resources">) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  if (!locale) notFound();
  await setRequestLocale(locale);

  const t = await getTranslations("Resources");
  const typeLabels = {
    website: t("types.website"),
    video: t("types.video"),
    book: t("types.book"),
    course: t("types.course"),
    practice: t("types.practice"),
  } satisfies Record<ResourceType, string>;
  const levelLabels = {
    beginner: t("levels.beginner"),
    intermediate: t("levels.intermediate"),
    reference: t("levels.reference"),
  } satisfies Record<ResourceLevel, string>;

  const categories = getResourceCategories(locale);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">{t("description")}</p>

      {/* 页内快速导航 */}
      <nav className="mt-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <a
            key={category.key}
            href={`#${category.key}`}
            className="rounded-full border border-zinc-200 px-3.5 py-1.5 text-sm text-zinc-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
          >
            {category.title}
          </a>
        ))}
      </nav>

      {/* 分类区块 */}
      <div className="mt-12 flex flex-col gap-14">
        {categories.map((category) => (
          <section key={category.key} id={category.key} className="scroll-mt-20">
            <h2 className="text-xl font-semibold tracking-tight">
              {category.title}
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {category.description}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {category.resources.map((resource) => (
                <ResourceCard
                  key={resource.url}
                  resource={resource}
                  typeLabels={typeLabels}
                  levelLabels={levelLabels}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
