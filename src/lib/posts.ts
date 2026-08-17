import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx";
import type { Locale } from "@/i18n/routing";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type PostFrontmatter = {
  title: string;
  /** YYYY-MM-DD */
  date: string;
  description: string;
  tags?: string[];
  draft?: boolean;
};

export type PostMeta = PostFrontmatter & { slug: string };

export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
  content: React.ReactElement;
  /** 预计阅读分钟数 */
  readTime: number;
};

const prettyCodeOptions = {
  theme: {
    light: "github-light",
    dark: "github-dark",
  },
  keepBackground: false,
};

function getPostFiles(locale: Locale) {
  const dir = path.join(CONTENT_DIR, locale, "blog");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
}

function readContent(...segments: string[]) {
  return fs.readFileSync(path.join(CONTENT_DIR, ...segments), "utf8");
}

/** 解析一篇文章的 frontmatter（不编译正文，用于列表页） */
export function getAllPosts(locale: Locale): PostMeta[] {
  return getPostFiles(locale)
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { data } = matter(readContent(locale, "blog", file));
      return { slug, ...(data as PostFrontmatter) };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllTags(locale: Locale): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts(locale)) {
    for (const tag of post.tags ?? []) tags.add(tag);
  }
  return [...tags];
}

/** 预计阅读分钟数：中文按 400 字/分钟，英文按 200 词/分钟 */
function estimateReadTime(locale: Locale, raw: string) {
  const text = matter(raw).content;
  if (locale === "zh") {
    const chars = text.replace(/\s/g, "").length;
    return Math.max(1, Math.round(chars / 400));
  }
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** 编译单篇文章：解析 frontmatter、渲染 MDX、计算阅读时间 */
export async function getPost(locale: Locale, slug: string): Promise<Post | null> {
  const file = path.join(CONTENT_DIR, locale, "blog", `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, "utf8");
  const { content, frontmatter } = await compileMDX<PostFrontmatter>({
    source: raw,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
      },
    },
  });

  return { slug, frontmatter, content, readTime: estimateReadTime(locale, raw) };
}

/** 编译 content/{locale}/about.mdx 等单页内容 */
export async function getContentPage(
  locale: Locale,
  name: string,
): Promise<{ content: React.ReactElement; frontmatter: Record<string, unknown> } | null> {
  const file = path.join(CONTENT_DIR, locale, `${name}.mdx`);
  if (!fs.existsSync(file)) return null;

  const { content, frontmatter } = await compileMDX({
    source: fs.readFileSync(file, "utf8"),
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });
  return { content, frontmatter };
}
