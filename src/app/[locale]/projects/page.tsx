import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, toLocale } from "@/i18n/routing";
import { getProjects, type Project } from "@/lib/projects";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = toLocale(locale) ?? routing.defaultLocale;
  const t = await getTranslations({ locale: validLocale, namespace: "Projects" });
  return { title: t("title"), description: t("description") };
}

function ProjectCard({
  project,
  demoLabel,
  repoLabel,
}: {
  project: Project;
  demoLabel: string;
  repoLabel: string;
}) {
  return (
    <article className="flex flex-col rounded-xl border border-zinc-200 p-5 transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:hover:border-indigo-700">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
        <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
          {project.year}
        </span>
      </div>
      <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="mt-4 flex gap-4 text-sm">
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400"
          >
            {repoLabel} ↗
          </a>
        )}
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400"
          >
            {demoLabel} ↗
          </a>
        )}
      </div>
    </article>
  );
}

export default async function ProjectsPage({
  params,
}: PageProps<"/[locale]/projects">) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  if (!locale) notFound();
  await setRequestLocale(locale);

  const t = await getTranslations("Projects");
  const projects = getProjects(locale);
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  const grid = (items: Project[]) => (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((project) => (
        <ProjectCard
          key={project.title}
          project={project}
          demoLabel={t("demo")}
          repoLabel={t("repo")}
        />
      ))}
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">{t("description")}</p>

      {projects.length === 0 ? (
        <p className="mt-16 text-center text-zinc-500 dark:text-zinc-400">
          {t("empty")}
        </p>
      ) : (
        <div className="mt-10 flex flex-col gap-10">
          {featured.length > 0 && (
            <section>
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                ★ Featured
              </h2>
              {grid(featured)}
            </section>
          )}
          {others.length > 0 && <section>{grid(others)}</section>}
        </div>
      )}
    </div>
  );
}
