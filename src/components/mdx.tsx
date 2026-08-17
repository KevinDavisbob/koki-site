/* eslint-disable @next/next/no-img-element */
import type { Route } from "next";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { Link } from "@/i18n/navigation";

// 供 MDX 内容（博客文章、关于页）使用的自定义组件样式。
// 代码块样式在 globals.css 中由 rehype-pretty-code 的输出驱动。
export const mdxComponents: NonNullable<MDXRemoteProps["components"]> = {
  h1: ({ children }) => (
    <h1 className="mt-10 mb-5 text-3xl font-bold tracking-tight">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 mb-4 text-2xl font-bold tracking-tight">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 text-xl font-semibold tracking-tight">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="my-5 leading-8 text-zinc-700 dark:text-zinc-300">{children}</p>
  ),
  a: ({ href, children }) => {
    const linkCls =
      "font-medium text-indigo-600 underline decoration-indigo-600/30 underline-offset-4 transition-colors hover:decoration-indigo-600 dark:text-indigo-400 dark:decoration-indigo-400/30 dark:hover:decoration-indigo-400";
    // 站内链接用 next-intl 的 Link（自动带语言前缀），外链新窗口打开
    if (href?.startsWith("/")) {
      return (
        <Link href={href as Route} className={linkCls}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noreferrer" className={linkCls}>
        {children}
      </a>
    );
  },
  ul: ({ children }) => (
    <ul className="my-5 list-disc space-y-2 pl-6 text-zinc-700 marker:text-zinc-400 dark:text-zinc-300">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-5 list-decimal space-y-2 pl-6 text-zinc-700 marker:text-zinc-400 dark:text-zinc-300">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-8">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 rounded-r-lg border-l-4 border-indigo-400 bg-indigo-50/60 py-1 pl-5 pr-4 text-zinc-600 [&>p]:my-2 dark:border-indigo-500/60 dark:bg-indigo-950/30 dark:text-zinc-300">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
      {children}
    </strong>
  ),
  hr: () => <hr className="my-10 border-zinc-200 dark:border-zinc-800" />,
  img: (props) => (
    <img
      {...props}
      alt={props.alt ?? ""}
      className="my-8 rounded-xl border border-zinc-200 dark:border-zinc-800"
    />
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b-2 border-zinc-200 dark:border-zinc-700">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-b border-zinc-100 px-3 py-2 dark:border-zinc-800">
      {children}
    </td>
  ),
};
