import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { PostCard } from "@/components/post-card";
import { toLocale } from "@/i18n/routing";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

/** 板块卡片：标题/描述复用各板块自己的翻译命名空间 */
const SECTION_ITEMS = [
  { href: "/blog", emoji: "📝", ns: "Blog" },
  { href: "/projects", emoji: "🛠️", ns: "Projects" },
  { href: "/security", emoji: "🛡️", ns: "Security" },
  { href: "/cars", emoji: "🚗", ns: "Cars" },
  { href: "/physics", emoji: "⚡", ns: "Physics" },
  { href: "/roadmap", emoji: "🗺️", ns: "Roadmap" },
  { href: "/resources", emoji: "📚", ns: "Resources" },
  { href: "/books", emoji: "📖", ns: "Books" },
  { href: "/challenge", emoji: "🚩", ns: "Challenge" },
] as const;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  if (!locale) notFound();
  await setRequestLocale(locale);
  const t = await getTranslations("Home");

  const recentPosts = getAllPosts(locale).slice(0, 3);

  const sections = await Promise.all(
    SECTION_ITEMS.map(async (s) => {
      const ns = await getTranslations(s.ns);
      return { ...s, title: ns("title"), description: ns("description") };
    }),
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-6">
      {/* Hero */}
      <section className="py-20 sm:py-28">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t("greeting")}
          <span className="text-indigo-500">。</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {t("intro")}
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/blog"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            {t("viewBlog")}
          </Link>
          <Link
            href="/about"
            className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            {t("aboutMe")}
          </Link>
        </div>
        <div className="mt-10 flex gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            GitHub
          </a>
          <a
            href={`mailto:${siteConfig.social.email}`}
            className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {siteConfig.social.email}
          </a>
        </div>
      </section>

      {/* 探索：板块导航网格 */}
      <section className="pb-20">
        <h2 className="mb-2 text-xl font-semibold tracking-tight">
          {t("sections")}
        </h2>
        <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
          {t("sectionsHint")}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group block rounded-xl border border-zinc-200 p-5 transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:hover:border-indigo-700"
            >
              <span className="text-2xl" aria-hidden="true">
                {s.emoji}
              </span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {s.title}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                {s.description}
              </p>
              <span
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-transform duration-200 group-hover:translate-x-0.5 dark:text-indigo-400"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 最近文章 */}
      <section className="pb-24">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            {t("recentPosts")}
          </h2>
          <Link
            href="/blog"
            className="text-sm text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400"
          >
            {t("viewAll")} →
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {recentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
