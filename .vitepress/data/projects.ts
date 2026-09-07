type Locale = "zh" | "en"

export type Project = {
  title: string;
  description: string;
  /** 在线演示地址 */
  url?: string;
  /** GitHub 仓库地址 */
  repo?: string;
  /** 站内复盘文章（如 /blog/wechat-bot） */
  article?: string;
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
    title: "微信群 AI 助手",
    description:
      "微信 4.x 没有可用的自动化接口，于是用截图 + OCR + 坐标点击给目标群做了个 AI 助手：群里 @ 它，它就用 DeepSeek 生成回复。全程不碰协议、不碰安全边界。",
    article: "/blog/wechat-bot",
    tech: ["Python", "OCR", "Win32 API", "DeepSeek"],
    year: "2026",
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
    title: "WeChat Group AI Assistant",
    description:
      "WeChat 4.x has no usable automation interface, so I built a group-chat AI assistant with screenshots + OCR + coordinate clicks. Mention it in the group and it replies via DeepSeek — no protocols, no security-boundary violations.",
    article: "/blog/wechat-bot",
    tech: ["Python", "OCR", "Win32 API", "DeepSeek"],
    year: "2026",
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
