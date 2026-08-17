import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { PostMeta } from "@/lib/posts";

export async function PostCard({ post }: { post: PostMeta }) {
  const locale = await getLocale();
  const formatted = new Intl.DateTimeFormat(
    locale === "zh" ? "zh-CN" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  ).format(new Date(`${post.date}T00:00:00`));

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl border border-zinc-200 p-5 transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:hover:border-indigo-700"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
        <time dateTime={post.date}>{formatted}</time>
        {(post.tags ?? []).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-zinc-200 px-2 py-0.5 dark:border-zinc-700"
          >
            {tag}
          </span>
        ))}
      </div>
      <h3 className="mt-3 text-lg font-semibold tracking-tight transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
        {post.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
        {post.description}
      </p>
    </Link>
  );
}
