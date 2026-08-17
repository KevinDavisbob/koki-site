# koki.cn

Koki 的个人网站 / 博客，支持中英双语与暗色模式。

## 技术栈

- **框架**：Next.js 16（App Router + Turbopack）、React 19、TypeScript
- **样式**：Tailwind CSS 4（暗色模式）
- **国际化**：next-intl —— 中文为默认语言（`/`），英文带前缀（`/en`）
- **内容**：MDX（next-mdx-remote + remark-gfm + rehype-pretty-code 代码高亮）

## 本地开发

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 生产构建（全部页面预渲染为静态 HTML）
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
| 主题色 / 样式 | `src/app/globals.css` + 各组件中的 indigo 色值 |
| 新增语言 | `src/i18n/routing.ts` + `messages/` 新目录 |

## 部署

项目是纯静态预渲染 + 少量动态页面，推荐 [Vercel](https://vercel.com)：

1. 将代码推到 GitHub 仓库
2. Vercel 导入仓库即可自动部署（无需任何配置）
3. 在 Vercel 控制台把 `koki.cn` 域名绑定到项目，并按提示到域名服务商处添加解析

部署后记得把 `src/lib/site.ts` 里的占位链接（GitHub、邮箱）换成你自己的。
