import type { Locale } from "@/i18n/routing";

export type Project = {
  title: string;
  description: string;
  /** 在线演示地址 */
  url?: string;
  /** GitHub 仓库地址 */
  repo?: string;
  tech: string[];
  /** 开始年份 */
  year: string;
  featured?: boolean;
};

// TODO: 把下面的示例项目换成你自己的项目（课程设计、比赛作品、业余项目都可以）
const zh: Project[] = [
  {
    title: "Koki 个人博客",
    description:
      "就是你现在看到的这个网站：Next.js 16 + Tailwind CSS 4 构建，支持中英双语、暗色模式、MDX 博客。从零开始写的第一个完整 Web 项目。",
    url: "https://koki.asia",
    repo: "https://github.com/KevinDavisbob/koki-site",
    tech: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
    year: "2026",
    featured: true,
  },
  {
    title: "示例项目：待替换",
    description:
      "这里放一个你的课程设计或小作品。编辑 src/lib/projects.ts 把它替换掉。",
    url: "https://example.com",
    repo: "https://github.com/KevinDavisbob",
    tech: ["C++", "Qt"],
    year: "2025",
    featured: true,
  },
  {
    title: "示例项目：待替换",
    description:
      "这里可以放比赛作品、小工具、爬虫脚本……任何让你有成就感的作品。",
    url: "https://example.com",
    repo: "https://github.com/KevinDavisbob",
    tech: ["Python", "Flask"],
    year: "2025",
  },
];

const en: Project[] = [
  {
    title: "Koki Blog",
    description:
      "This very website — built with Next.js 16 and Tailwind CSS 4, with i18n (Chinese/English), dark mode and an MDX-powered blog. My first complete web project from scratch.",
    url: "https://koki.asia",
    repo: "https://github.com/KevinDavisbob/koki-site",
    tech: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
    year: "2026",
    featured: true,
  },
  {
    title: "Placeholder: replace me",
    description:
      "Put a coursework or side project here. Edit src/lib/projects.ts to replace it.",
    url: "https://example.com",
    repo: "https://github.com/KevinDavisbob",
    tech: ["C++", "Qt"],
    year: "2025",
    featured: true,
  },
  {
    title: "Placeholder: replace me",
    description:
      "A competition entry, a small tool, a scraper script — anything you're proud of.",
    url: "https://example.com",
    repo: "https://github.com/KevinDavisbob",
    tech: ["Python", "Flask"],
    year: "2025",
  },
];

const data: Record<Locale, Project[]> = { zh, en };

export function getProjects(locale: Locale): Project[] {
  return data[locale];
}
