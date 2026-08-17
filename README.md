# koki's Blog

koki 的个人网站：信息安全学生的技术博客，支持中英双语与暗色模式。

- **域名**：https://koki.asia（已上线，国内可直连）
- **作者**：koki（KevinDavisbob）· 汕头职业技术学院 · 信息安全应用技术 · 大二
- **联系**：3210254261@qq.com

## 站点板块

| 板块 | 路由 | 内容 |
| --- | --- | --- |
| 首页 | `/` | Hero + 最近文章 |
| 博客 | `/blog` | MDX 文章、标签筛选、按年归档（`/archive`） |
| 项目 | `/projects` | 项目作品展示 |
| 安全 | `/security` | 安全学习路线、实战平台、密码学小工具 |
| CTF 挑战 | `/challenge` | 3 关迷你 CTF（源码/控制台/响应头） |
| 汽车 | `/cars` | 汽车知识百科 + 4 个互动模拟器 |
| 路线 | `/roadmap` | 编程学习路线（含信息安全方向） |
| 资料 | `/resources` | 精选学习资源 |
| 书单 | `/books` | 在读/已读/想读 |
| 关于 | `/about` | 个人介绍 |

## 技术栈

- **框架**：Next.js 16（App Router + Turbopack）、React 19、TypeScript
- **样式**：Tailwind CSS 4（暗色模式）
- **国际化**：next-intl —— 中文为默认语言（`/`），英文带前缀（`/en`）
- **内容**：MDX（next-mdx-remote + remark-gfm + rehype-pretty-code 代码高亮）
- **部署**：Vercel（全页面静态预渲染）

## 本地开发

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 生产构建
npm start        # 运行生产构建
```

## 写文章

在 `content/zh/blog/`（中文）或 `content/en/blog/`（英文）下新建 `.mdx` 文件，
中英文文章使用**相同的文件名**，即可在两种语言间自动切换对应文章：

```mdx
---
title: "文章标题"
date: "2026-08-17"
description: "文章简介，显示在列表页"
tags: ["标签1", "标签2"]
draft: true  # 可选，草稿不发布
---

正文（Markdown / MDX 语法，支持 GFM 表格、任务列表、代码高亮等）
```

## 常用修改

| 想改什么 | 去哪改 |
| --- | --- |
| 站名、域名、GitHub / 邮箱链接 | `src/lib/site.ts` |
| 界面文案（导航、按钮等） | `messages/zh.json`、`messages/en.json` |
| 关于页内容 | `content/zh/about.mdx`、`content/en/about.mdx` |
| 首页介绍 | `messages/*.json` 里的 `Home.intro` |
| 项目列表 | `src/lib/projects.ts` |
| 安全内容 | `src/lib/security.ts` |
| 汽车知识/术语 | `src/lib/cars.ts` |
| 模拟器 | `src/components/car-sims.tsx` |
| 学习路线 | `src/lib/roadmaps.ts` |
| 学习资源 | `src/lib/resources.ts` |
| 书单 | `src/lib/books.ts` |
| CTF 挑战关卡 | `src/components/challenge-game.tsx` + `src/proxy.ts` |
| 主题色 / 样式 | `src/app/globals.css` |

## 部署

- 生产：`vercel deploy --prod`
- 自定义域名 koki.asia 已绑定（DNS：A 记录 76.76.21.21），国内可直连；`*.vercel.app` 地址在国内不稳定，仅用于临时验证
- `sitemap` / `canonical` 已指向 `https://koki.asia`（在 `src/lib/site.ts`）
