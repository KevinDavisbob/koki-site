import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getAllPosts, getPost } from "@/lib/posts";
import { routing, toLocale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";
import { ReadingProgress } from "@/components/reading-progress";

// 注意：Next 16 中 generateStaticParams 的 params 是同步对象（页面组件的才是 Promise）
export function generateStaticParams({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const validLocale = toLocale(params.locale);
  return validLocale ? getAllPosts(validLocale).map(({ slug }) => ({ slug })) : [];
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const validLocale = toLocale(locale);
  const post = validLocale ? await getPost(validLocale, slug) : null;
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: {
      canonical: `${siteConfig.url}${locale === routing.defaultLocale ? "" : `/${locale}`}/blog/${slug}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          `${siteConfig.url}${l === routing.defaultLocale ? "" : `/${l}`}/blog/${slug}`,
        ]),
      ),
    },
  };
}

export default async function PostPage({
  params,
}: PageProps<"/[locale]/blog/[slug]">) {
  const { locale: rawLocale, slug } = await params;
  const locale = toLocale(rawLocale);
  if (!locale) notFound();
  await setRequestLocale(locale);
  const t = await getTranslations("Post");

  const post = await getPost(locale, slug);
  if (!post) notFound();

  const { frontmatter } = post;
  const formatted = new Intl.DateTimeFormat(
    locale === "zh" ? "zh-CN" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  ).format(new Date(`${frontmatter.date}T00:00:00`));

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
      <Link
        href="/blog"
        className="text-sm text-zinc-500 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
      >
        ← {t("backToBlog")}
      </Link>

      <header className="mt-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {frontmatter.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
          <time dateTime={frontmatter.date}>{formatted}</time>
          <span aria-hidden>·</span>
          <span>
            {post.readTime} {t("readMinutes")}
          </span>
        </div>
        {(frontmatter.tags ?? []).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {frontmatter.tags?.map((tag) => (
              <Link
                key={tag}
                href={{ pathname: "/blog", query: { tag } }}
                className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-500 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        {post.content}
      </div>
      </article>
    </>
  );
}
