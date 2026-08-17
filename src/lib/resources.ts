import type { Locale } from "@/i18n/routing";

export type ResourceType = "website" | "video" | "book" | "course" | "practice";
export type ResourceLevel = "beginner" | "intermediate" | "reference";

export type Resource = {
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  level: ResourceLevel;
  /** 推荐指数 1-5，用于排序 */
  rating: number;
};

export type ResourceCategory = {
  key: string;
  title: string;
  description: string;
  resources: Resource[];
};

// 精选原则：免费优先、小白好上手、口碑公认
const zh: ResourceCategory[] = [
  {
    key: "cpp",
    title: "C++",
    description: "从零基础到进阶的经典路线：先看视频/教程入门，再刷题巩固，最后读经典书籍。",
    resources: [
      {
        title: "黑马程序员 C++ 教程（B 站）",
        description: "国内最经典的 C++ 系统入门视频课，零基础友好，跟着敲完能掌握大部分常用语法。",
        url: "https://www.bilibili.com/video/BV1et411b73Z",
        type: "video",
        level: "beginner",
        rating: 5,
      },
      {
        title: "菜鸟教程 · C++",
        description: "语法速查手册，学完视频后当字典用，忘了就翻。",
        url: "https://www.runoob.com/cplusplus/cpp-tutorial.html",
        type: "website",
        level: "beginner",
        rating: 4,
      },
      {
        title: "洛谷",
        description: "国内最好的入门刷题平台，题目分难度标签，从小白题开始练手。",
        url: "https://www.luogu.com.cn",
        type: "practice",
        level: "beginner",
        rating: 5,
      },
      {
        title: "《C++ Primer（中文版）》",
        description: "C++ 领域公认的经典教材，学完入门课后再啃它，基本功会很扎实。",
        url: "https://book.douban.com/subject/25708312/",
        type: "book",
        level: "intermediate",
        rating: 5,
      },
      {
        title: "cppreference 中文站",
        description: "C++ 官方风格的参考文档，查标准库和语法细节必备。",
        url: "https://zh.cppreference.com",
        type: "website",
        level: "reference",
        rating: 4,
      },
    ],
  },
  {
    key: "python",
    title: "Python",
    description: "最容易上手的语言，适合快速体验编程的乐趣。",
    resources: [
      {
        title: "廖雪峰 Python 教程",
        description: "中文圈口碑最好的 Python 入门教程之一，讲解清晰、循序渐进。",
        url: "https://liaoxuefeng.com/books/python/introduction/index.html",
        type: "website",
        level: "beginner",
        rating: 5,
      },
      {
        title: "嵩天《Python 语言程序设计》（中国大学 MOOC）",
        description: "北理工的国家级精品课，系统性强，配套习题和考试。",
        url: "https://www.icourse163.org/course/BIT-268001",
        type: "course",
        level: "beginner",
        rating: 5,
      },
      {
        title: "菜鸟教程 · Python3",
        description: "轻量级语法速查，配合其他教程使用。",
        url: "https://www.runoob.com/python3/python3-tutorial.html",
        type: "website",
        level: "beginner",
        rating: 3,
      },
    ],
  },
  {
    key: "web",
    title: "Web 开发",
    description: "HTML / CSS / JavaScript 三件套，做出能分享给别人的网页。",
    resources: [
      {
        title: "MDN Web 文档（中文）",
        description: "Web 开发的官方权威文档，HTML/CSS/JS 的百科全书。",
        url: "https://developer.mozilla.org/zh-CN/",
        type: "website",
        level: "reference",
        rating: 5,
      },
      {
        title: "阮一峰 JavaScript 教程（网道）",
        description: "国内最流行的 JS 入门教程，中文讲解透彻，入门 ES6 就看它。",
        url: "https://wangdoc.com/javascript/",
        type: "website",
        level: "beginner",
        rating: 5,
      },
      {
        title: "freeCodeCamp（中文版）",
        description: "边做边学的免费课程平台，做完题目直接获得认证，成就感满满。",
        url: "https://www.freecodecamp.org/chinese/learn",
        type: "course",
        level: "beginner",
        rating: 5,
      },
    ],
  },
  {
    key: "algo",
    title: "数据结构与算法",
    description: "编程能力的核心，也是面试的必修课。",
    resources: [
      {
        title: "力扣（LeetCode 中文站）",
        description: "最主流的刷题平台，题解社区活跃，从「两数之和」开始。",
        url: "https://leetcode.cn",
        type: "practice",
        level: "beginner",
        rating: 5,
      },
      {
        title: "Hello 算法",
        description: "开源免费的图解算法书，动画 + 图解 + 代码，对小白极其友好。",
        url: "https://www.hello-algo.com",
        type: "book",
        level: "beginner",
        rating: 5,
      },
      {
        title: "《算法图解》",
        description: "用漫画讲算法，半天就能翻完，建立算法直觉的第一本书。",
        url: "https://book.douban.com/subject/26979890/",
        type: "book",
        level: "beginner",
        rating: 4,
      },
    ],
  },
  {
    key: "security",
    title: "网络安全",
    description: "信息安全方向的起步资源：CTF、Web 安全与靶场，全部在合法授权范围内练习。",
    resources: [
      {
        title: "picoCTF",
        description: "卡内基梅隆大学办的入门 CTF，题目从易到难，零基础友好。",
        url: "https://picoctf.org",
        type: "practice",
        level: "beginner",
        rating: 5,
      },
      {
        title: "BUUCTF",
        description: "国内最活跃的 CTF 刷题平台，题目全、题解多。",
        url: "https://buuoj.cn",
        type: "practice",
        level: "beginner",
        rating: 5,
      },
      {
        title: "CTF Wiki",
        description: "CTF 百科全书：Web、逆向、pwn、密码学各个方向的知识库。",
        url: "https://ctf-wiki.org",
        type: "website",
        level: "reference",
        rating: 5,
      },
      {
        title: "PortSwigger Web Security Academy",
        description: "Burp Suite 官方出的免费 Web 安全实战课，业界口碑第一。",
        url: "https://portswigger.net/web-security",
        type: "course",
        level: "beginner",
        rating: 5,
      },
      {
        title: "TryHackMe",
        description: "互动式攻防学习平台，浏览器里就能开靶机，闯关式学习。",
        url: "https://tryhackme.com",
        type: "practice",
        level: "beginner",
        rating: 4,
      },
      {
        title: "《Web 安全攻防：渗透测试实战指南》",
        description: "中文 Web 安全入门经典，配合靶场练习效果更好。",
        url: "https://book.douban.com/subject/30276111/",
        type: "book",
        level: "intermediate",
        rating: 4,
      },
    ],
  },
  {
    key: "tools",
    title: "Git 与开发工具",
    description: "会用工具，效率翻倍。",
    resources: [
      {
        title: "廖雪峰 Git 教程",
        description: "中文最好的 Git 入门教程，模拟真实场景，学完就能用 Git 管理代码。",
        url: "https://liaoxuefeng.com/books/git/introduction/index.html",
        type: "website",
        level: "beginner",
        rating: 5,
      },
      {
        title: "GitHub 官方文档（中文）",
        description: "GitHub 官方中文文档，托管代码、协作开发从这里开始。",
        url: "https://docs.github.com/zh",
        type: "website",
        level: "reference",
        rating: 4,
      },
      {
        title: "Visual Studio Code",
        description: "最流行的免费代码编辑器，装上它就拥有了完整开发环境。",
        url: "https://code.visualstudio.com",
        type: "website",
        level: "beginner",
        rating: 5,
      },
    ],
  },
];

const en: ResourceCategory[] = [
  {
    key: "cpp",
    title: "C++",
    description: "The classic path from zero to competent: watch/read a beginner course, practice on a judge, then read the classics.",
    resources: [
      {
        title: "learncpp.com",
        description: "Widely regarded as the best free C++ tutorial on the web — thorough, modern, beginner-friendly.",
        url: "https://www.learncpp.com",
        type: "website",
        level: "beginner",
        rating: 5,
      },
      {
        title: "Exercism · C++ Track",
        description: "Practice C++ with mentor-reviewed exercises, from hello world to real problems.",
        url: "https://exercism.org/tracks/cpp",
        type: "practice",
        level: "beginner",
        rating: 4,
      },
      {
        title: "C++ Primer",
        description: "The definitive C++ book. Work through it after a beginner course for solid fundamentals.",
        url: "https://www.informit.com/store/c-plus-plus-primer-9780321714114",
        type: "book",
        level: "intermediate",
        rating: 5,
      },
      {
        title: "cppreference.com",
        description: "The standard reference for C++ — indispensable when you need precise language details.",
        url: "https://en.cppreference.com",
        type: "website",
        level: "reference",
        rating: 5,
      },
      {
        title: "C++ Core Guidelines",
        description: "Best practices for modern C++ from Bjarne Stroustrup and Herb Sutter.",
        url: "https://isocpp.github.io/CppCoreGuidelines/",
        type: "website",
        level: "reference",
        rating: 4,
      },
    ],
  },
  {
    key: "python",
    title: "Python",
    description: "The easiest language to start with — see results fast and have fun.",
    resources: [
      {
        title: "The Python Tutorial (python.org)",
        description: "The official tutorial from the language itself — the canonical starting point.",
        url: "https://docs.python.org/3/tutorial/",
        type: "website",
        level: "beginner",
        rating: 5,
      },
      {
        title: "CS50's Introduction to Programming with Python",
        description: "Harvard's famous course, Python edition — engaging lectures and problem sets.",
        url: "https://cs50.harvard.edu/python/",
        type: "course",
        level: "beginner",
        rating: 5,
      },
      {
        title: "Automate the Boring Stuff with Python",
        description: "Learn Python by automating real-life tasks. Free to read online.",
        url: "https://automatetheboringstuff.com",
        type: "book",
        level: "beginner",
        rating: 4,
      },
    ],
  },
  {
    key: "web",
    title: "Web Development",
    description: "HTML, CSS and JavaScript — build pages you can share with anyone.",
    resources: [
      {
        title: "MDN Web Docs",
        description: "The authoritative documentation for the web platform, from Mozilla.",
        url: "https://developer.mozilla.org/",
        type: "website",
        level: "reference",
        rating: 5,
      },
      {
        title: "The Odin Project",
        description: "A complete open-source full-stack curriculum with real projects along the way.",
        url: "https://www.theodinproject.com",
        type: "course",
        level: "beginner",
        rating: 5,
      },
      {
        title: "freeCodeCamp",
        description: "Learn by doing with thousands of interactive exercises — earn certificates as you go.",
        url: "https://www.freecodecamp.org/learn",
        type: "course",
        level: "beginner",
        rating: 5,
      },
    ],
  },
  {
    key: "algo",
    title: "Data Structures & Algorithms",
    description: "The core of programming ability — and the foundation for interviews.",
    resources: [
      {
        title: "LeetCode",
        description: "The most popular practice platform, with an active community and solutions for every problem.",
        url: "https://leetcode.com",
        type: "practice",
        level: "beginner",
        rating: 5,
      },
      {
        title: "Hello Algo",
        description: "A free open-source book with animated illustrations and runnable code — extremely beginner-friendly.",
        url: "https://www.hello-algo.com/en/",
        type: "book",
        level: "beginner",
        rating: 5,
      },
      {
        title: "VisuAlgo",
        description: "Visualize algorithms and data structures with interactive animations.",
        url: "https://visualgo.net",
        type: "website",
        level: "beginner",
        rating: 4,
      },
    ],
  },
  {
    key: "security",
    title: "Cybersecurity",
    description: "Getting started in security: CTF, web security and labs — always in authorized environments.",
    resources: [
      {
        title: "picoCTF",
        description: "CMU's beginner-friendly CTF with a gentle difficulty curve.",
        url: "https://picoctf.org",
        type: "practice",
        level: "beginner",
        rating: 5,
      },
      {
        title: "HackTheBox",
        description: "The classic hacker playground — real machines, real skills.",
        url: "https://www.hackthebox.com",
        type: "practice",
        level: "beginner",
        rating: 5,
      },
      {
        title: "PortSwigger Web Security Academy",
        description: "Free hands-on web security courses from the makers of Burp Suite.",
        url: "https://portswigger.net/web-security",
        type: "course",
        level: "beginner",
        rating: 5,
      },
      {
        title: "TryHackMe",
        description: "Guided, interactive learning paths with in-browser machines.",
        url: "https://tryhackme.com",
        type: "practice",
        level: "beginner",
        rating: 4,
      },
      {
        title: "OverTheWire",
        description: "The Bandit wargame is the classic first step into Linux and security.",
        url: "https://overthewire.org",
        type: "practice",
        level: "beginner",
        rating: 4,
      },
      {
        title: "CTFtime",
        description: "The global CTF calendar — competitions, writeups, rankings.",
        url: "https://ctftime.org",
        type: "website",
        level: "reference",
        rating: 4,
      },
    ],
  },
  {
    key: "tools",
    title: "Git & Developer Tools",
    description: "Good tools multiply your productivity.",
    resources: [
      {
        title: "Pro Git (free online book)",
        description: "The official free Git book — the most complete guide to Git, from basics to internals.",
        url: "https://git-scm.com/book/en/v2",
        type: "book",
        level: "beginner",
        rating: 5,
      },
      {
        title: "GitHub Skills",
        description: "Interactive courses by GitHub to learn git and GitHub hands-on, right in your browser.",
        url: "https://skills.github.com",
        type: "course",
        level: "beginner",
        rating: 4,
      },
      {
        title: "Visual Studio Code",
        description: "The most popular free code editor — a complete development environment in one install.",
        url: "https://code.visualstudio.com",
        type: "website",
        level: "beginner",
        rating: 5,
      },
    ],
  },
];

const data: Record<Locale, ResourceCategory[]> = { zh, en };

export function getResourceCategories(locale: Locale): ResourceCategory[] {
  return data[locale];
}
