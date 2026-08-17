import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { PostCard } from "@/components/post-card";
import { toLocale } from "@/i18n/routing";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  if (!locale) notFound();
  await setRequestLocale(locale);
  const t = await getTranslations("Home");

  const recentPosts = getAllPosts(locale).slice(0, 3);

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
