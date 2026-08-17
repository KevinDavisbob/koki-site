import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { PostCard } from "@/components/post-card";
import { routing, toLocale } from "@/i18n/routing";
import { getAllPosts, getAllTags } from "@/lib/posts";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = toLocale(locale) ?? routing.defaultLocale;
  const t = await getTranslations({ locale: validLocale, namespace: "Blog" });
  return { title: t("title"), description: t("description") };
}

export default async function BlogPage({
  params,
  searchParams,
}: PageProps<"/[locale]/blog">) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  if (!locale) notFound();
  await setRequestLocale(locale);
  const { tag } = await searchParams;

  const t = await getTranslations("Blog");
  const activeTag = typeof tag === "string" ? tag : undefined;

  const posts = getAllPosts(locale);
  const tags = getAllTags(locale);
  const filtered = activeTag
    ? posts.filter((p) => p.tags?.includes(activeTag))
    : posts;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        {t("description")}
      </p>

      {/* 标签筛选：纯服务端渲染，Link 即可 */}
      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
            !activeTag
              ? "bg-indigo-600 text-white"
              : "border border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500"
          }`}
        >
          {t("all")}
        </Link>
        {tags.map((tag) => (
          <Link
            key={tag}
            href={{ pathname: "/blog", query: { tag } }}
            className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
              activeTag === tag
                ? "bg-indigo-600 text-white"
                : "border border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500"
            }`}
          >
            {tag}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-zinc-500 dark:text-zinc-400">
          {t("empty")}
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
