import { defineConfig } from 'vitepress'

const siteBase = process.env.VITEPRESS_BASE || '/'

const zhNav = [
  { text: '首页', link: '/' },
  { text: '博客', link: '/blog/' },
  { text: '项目', link: '/projects' },
  { text: '关于', link: '/about' },
  {
    text: '实验室',
    items: [
      { text: '安全', link: '/security' },
      { text: '汽车', link: '/cars' },
      { text: '物理', link: '/physics' },
      { text: 'CTF 挑战', link: '/challenge' },
    ],
  },
  {
    text: '学习',
    items: [
      { text: '学习路线', link: '/roadmap' },
      { text: '学习资料', link: '/resources' },
      { text: '书单', link: '/books' },
      { text: '文章归档', link: '/archive' },
      { text: '友链', link: '/friends' },
      { text: '留言板', link: '/guestbook' },
    ],
  },
]

const enNav = [
  { text: 'Home', link: '/en/' },
  { text: 'Blog', link: '/en/blog/' },
  { text: 'Projects', link: '/en/projects' },
  { text: 'About', link: '/en/about' },
  {
    text: 'Labs',
    items: [
      { text: 'Security', link: '/en/security' },
      { text: 'Cars', link: '/en/cars' },
      { text: 'Physics', link: '/en/physics' },
      { text: 'CTF Challenge', link: '/en/challenge' },
    ],
  },
  {
    text: 'Learn',
    items: [
      { text: 'Roadmap', link: '/en/roadmap' },
      { text: 'Resources', link: '/en/resources' },
      { text: 'Books', link: '/en/books' },
      { text: 'Archive', link: '/en/archive' },
      { text: 'Friends', link: '/en/friends' },
      { text: 'Guestbook', link: '/en/guestbook' },
    ],
  },
]

export default defineConfig({
  // GitHub Pages 项目站点部署在 /koki-site/；本地开发仍使用根路径。
  base: siteBase,
  lang: 'zh-CN',
  title: 'Koki · 个人网站',
  description: '记录技术、生活与思考。',
  // GitHub Pages 不提供服务端 URL 重写，保留 .html 才能直接访问页面。
  cleanUrls: false,
  ignoreDeadLinks: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#f5f5f7' }],
    ['link', { rel: 'icon', href: `${siteBase}favicon.svg` }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', href: `${siteBase}feed.xml`, title: 'Koki RSS' }],
  ],
  themeConfig: {
    nav: zhNav,
    locales: {
      root: { label: '中文', lang: 'zh-CN', nav: zhNav },
      en: { label: 'English', lang: 'en-US', nav: enNav },
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/KevinDavisbob' }],
    search: { provider: 'local' },
    outline: { level: [2, 3] },
    docFooter: { prev: false, next: false },
    footer: {
      message: '记录技术、生活与思考。',
      copyright: '© 2026 Koki',
    },
  },
  locales: {
    root: { label: '中文', lang: 'zh-CN', title: 'Koki · 个人网站', description: '记录技术、生活与思考。' },
    en: { label: 'English', lang: 'en-US', title: "Koki · Personal Site", description: 'Notes on tech, life, and thoughts.' },
  },
  vite: {
    server: { fs: { strict: false } },
  },
})
