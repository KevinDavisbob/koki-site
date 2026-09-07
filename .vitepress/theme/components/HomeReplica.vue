<script setup lang="ts">
const props = defineProps<{ locale: 'zh' | 'en' }>()
const en = props.locale === 'en'
const base = import.meta.env.BASE_URL.replace(/\/$/, '')
const prefix = en ? `${base}/en` : base
const sitePath = (path: string) => `${base}${path.endsWith('/') ? path : `${path}.html`}`
const posts = en ? [
  ['2026-08-19', 'One Month Into Security: The Three Lessons That Mattered Most', 'An essay: from SQL injection to my first XSS payload, from launching this blog to building a WeChat bot.', 'first-month-essay'],
  ['2026-08-19', "Putting an AI in a WeChat Group: Screenshots, OCR, and Coordinate Clicks", 'A project retrospective about screenshots, OCR and Win32 messages.', 'wechat-bot'],
  ['2026-08-17', 'SQL Injection 101: It Starts With One Quote', 'What SQL injection is, how a classic payload bypasses authentication, and why parameters stop it.', 'sql-injection'],
] : [
  ['2026-08-19', '学安全一个月，我最大的三句心得', '从 SQL 注入到第一条 XSS payload，从搭博客到写微信机器人。', 'first-month-essay'],
  ['2026-08-19', '把一个 AI 塞进微信群：截图 + OCR + 坐标点击的野路子自动化', '用截图、OCR 和 Win32 消息给微信群做一个 AI 助手。', 'wechat-bot'],
  ['2026-08-17', 'SQL 注入入门：从一条引号开始', "什么是 SQL 注入、' OR '1'='1 如何绕过验证，以及参数化查询为何有效。", 'sql-injection'],
]
const sections = en ? [
  ['📝', 'Blog', 'Articles about technology, tools and life.', '/blog/'], ['🛠️', 'Projects', 'Coursework, competition entries and experiments.', '/projects'], ['🛡️', 'Security', 'Web security, cryptography and CTF practice.', '/security'], ['🚗', 'Cars', 'Engines, gearboxes and electrification.', '/cars'], ['⚡', 'Physics', 'Motors, magnetic fields and energy conversion.', '/physics'], ['🗺️', 'Learning Roadmap', 'A practical path from basics to security research.', '/roadmap'], ['📚', 'Resources', 'Tutorials, books, videos and practice platforms.', '/resources'], ['📖', 'Books', 'Reading, finished and wish-list books.', '/books'], ['🚩', 'CTF Challenge', 'Six local browser puzzles.', '/challenge'],
] : [
  ['📝', '博客', '关于技术、工具与生活的文章。', '/blog/'], ['🛠️', '项目', '课程设计、比赛作品和业余折腾。', '/projects'], ['🛡️', '安全', 'Web 安全、密码学与 CTF 实践。', '/security'], ['🚗', '汽车', '发动机、变速箱与新能源知识。', '/cars'], ['⚡', '物理', '电机、磁场与能量转换。', '/physics'], ['🗺️', '学习路线', '从编程基础到安全实践的路线图。', '/roadmap'], ['📚', '学习资料', '教程、书籍、视频与刷题平台。', '/resources'], ['📖', '书单', '在读、已读和想读的书。', '/books'], ['🚩', 'CTF 挑战', '六个浏览器本地安全挑战。', '/challenge'],
]
</script>
<template>
  <main class="home-replica">
    <section class="home-hero"><h1>{{ en ? "Hi, I'm koki" : '你好，我是 koki' }}<span>。</span></h1><p>{{ en ? "A security student's corner of the internet: study notes, CTF challenges, car knowledge, and lessons learned along the way." : '汕头职业技术学院信息安全应用技术专业大二学生。这里是我的数字小窝：技术学习笔记、CTF 安全挑战、汽车知识百科，还有我踩过的坑和收藏的好东西。' }}</p><div class="home-actions"><a class="primary" :href="sitePath(en ? '/en/blog/' : '/blog/')">{{ en ? 'Read the blog' : '阅读博客' }}</a><a class="secondary" :href="sitePath(en ? '/en/about' : '/about')">{{ en ? 'About me' : '关于我' }}</a></div><div class="home-meta"><a href="https://github.com/KevinDavisbob">GitHub</a><a href="mailto:3210254261@qq.com">3210254261@qq.com</a><span>·</span><span>{{ en ? '10 posts · 20 tags' : '10 篇文章 · 20 个标签' }}</span></div></section>
    <section class="home-sections"><h2>{{ en ? 'Explore' : '探索' }}</h2><p>{{ en ? 'From technical notes to car knowledge, there is a little of everything.' : '从技术笔记到汽车知识，这里什么都有。' }}</p><div class="home-grid"><a v-for="s in sections" :key="s[3]" class="home-card" :href="sitePath(en ? `/en${s[3]}` : s[3])"><span class="home-card-icon">{{ s[0] }}</span><h3>{{ s[1] }}</h3><p>{{ s[2] }}</p><span class="arrow">→</span></a></div></section>
    <section class="home-posts"><div class="section-head"><h2>{{ en ? 'Recent posts' : '最近文章' }}</h2><a :href="sitePath(en ? '/en/blog/' : '/blog/')">{{ en ? 'View all →' : '查看全部 →' }}</a></div><div class="recent-list"><a v-for="p in posts" :key="p[3]" class="recent-card" :href="sitePath(`${en ? '/en' : ''}/blog/${p[3]}`)"><time>{{ p[0] }}</time><h3>{{ p[1] }}</h3><p>{{ p[2] }}</p></a></div></section>
  </main>
</template>
