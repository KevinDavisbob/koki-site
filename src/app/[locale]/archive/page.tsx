import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing, toLocale } from "@/i18n/routing";
import { getAllPosts } from "@/lib/posts";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/archive">): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = toLocale(locale) ?? routing.defaultLocale;
  const t = await getTranslations({ locale: validLocale, namespace: "Archive" });
  return { title: t("title"), description: t("description") };
}

export default async function ArchivePage({
  params,
}: PageProps<"/[locale]/archive">) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  if (!locale) notFound();
  await setRequestLocale(locale);

  const t = await getTranslations("Archive");
  const posts = getAllPosts(locale);

  // 按年份分组
  const years = new Map<string, typeof posts>();
  for (const post of posts) {
    const year = post.date.slice(0, 4);
    const list = years.get(year) ?? [];
    list.push(post);
    years.set(year, list);
  }

  const dateFormat = new Intl.DateTimeFormat(
    locale === "zh" ? "zh-CN" : "en-US",
    { month: "long", day: "numeric" },
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
      <Link
        href="/blog"
        className="text-sm text-zinc-500 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
      >
        ← {t("backToBlog")}
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">{t("description")}</p>

      {posts.length === 0 ? (
        <p className="mt-16 text-center text-zinc-500 dark:text-zinc-400">
          {t("empty")}
        </p>
      ) : (
        <div className="mt-10 flex flex-col gap-10">
          {[...years.entries()].map(([year, yearPosts]) => (
            <section key={year}>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {year} · {yearPosts.length}
              </h2>
              <ul className="flex flex-col gap-1">
                {yearPosts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex items-baseline gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      <time
                        dateTime={post.date}
                        className="shrink-0 text-sm tabular-nums text-zinc-400 dark:text-zinc-500"
                      >
                        {dateFormat.format(new Date(`${post.date}T00:00:00`))}
                      </time>
                      <span className="truncate transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {post.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
