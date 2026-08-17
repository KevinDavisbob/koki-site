import type { Locale } from "@/i18n/routing";

export type RoadmapStep = {
  title: string;
  /** 预计耗时，如 "1-2 周" */
  duration: string;
  description: string;
};

export type RoadmapTrack = {
  key: string;
  title: string;
  goal: string;
  steps: RoadmapStep[];
};

export type Roadmap = {
  tracks: RoadmapTrack[];
  tips: string[];
};

const zh: Roadmap = {
  tracks: [
    {
      key: "cpp",
      title: "C++ 路线",
      goal: "目标：掌握一门硬核语言，为算法竞赛、计算机课程和底层开发打好基础。",
      steps: [
        {
          title: "环境准备",
          duration: "1 天",
          description:
            "安装 VS Code 和 MinGW（或直接用 Dev-C++/小熊猫 C++），跑通第一个 Hello World。",
        },
        {
          title: "基础语法",
          duration: "4-8 周",
          description:
            "变量、分支循环、函数、数组、字符串。跟着黑马程序员 B 站课敲完前 100 集。",
        },
        {
          title: "核心进阶",
          duration: "4-6 周",
          description:
            "指针与引用、结构体与类、STL（vector/map/string）。这一步是 C++ 的分水岭，多敲多画图理解。",
        },
        {
          title: "刷题巩固",
          duration: "持续",
          description:
            "洛谷入门题单开始，每周 5-10 题，从「分支结构」「循环结构」标签刷起。",
        },
        {
          title: "小项目实战",
          duration: "2-4 周",
          description:
            "做一个完整的控制台项目：学生成绩管理系统、贪吃蛇或记账本，学会把语法组织成程序。",
        },
        {
          title: "继续精进",
          duration: "长期",
          description:
            "啃《C++ Primer》，学习数据结构与算法（Hello 算法），再决定走竞赛还是工程方向。",
        },
      ],
    },
    {
      key: "python",
      title: "Python 路线",
      goal: "目标：最快上手编程，用脚本解决身边的小问题。",
      steps: [
        {
          title: "环境准备",
          duration: "1 天",
          description: "安装 Python 3 和 VS Code，学会用 pip 装第三方库。",
        },
        {
          title: "语法入门",
          duration: "2-4 周",
          description:
            "跟着廖雪峰教程或嵩天 MOOC 学完基础语法，边学边在解释器里试。",
        },
        {
          title: "动手写小工具",
          duration: "2-4 周",
          description:
            "批量重命名文件、爬取网页、自动发邮件——挑一个真实需求做出来，比做练习题有效十倍。",
        },
        {
          title: "选择一个方向",
          duration: "长期",
          description: "数据分析（pandas）、爬虫（requests）、Web（Flask）或 AI，选一个深挖。",
        },
      ],
    },
    {
      key: "web",
      title: "Web 开发路线",
      goal: "目标：做出能分享给任何人的网页和应用。",
      steps: [
        {
          title: "HTML & CSS",
          duration: "2-4 周",
          description:
            "用 MDN 或 freeCodeCamp 学标签和样式，把任意页面 1:1 复刻出来。",
        },
        {
          title: "JavaScript 基础",
          duration: "4-8 周",
          description:
            "阮一峰教程 + freeCodeCamp 刷题，掌握 DOM 操作和 ES6 语法。",
        },
        {
          title: "第一个作品",
          duration: "1-2 周",
          description: "做一个个人主页或小游戏，部署到 Vercel/GitHub Pages，把链接发给朋友。",
        },
        {
          title: "框架与工程化",
          duration: "长期",
          description:
            "学习 React/Next.js（本站就是用它做的）、Git 协作、TypeScript，向完整项目进发。",
        },
      ],
    },
    {
      key: "security",
      title: "信息安全路线",
      goal: "目标：打牢网络与编程基础，通过 CTF 和靶场练出实战手感（全程合法授权）。",
      steps: [
        {
          title: "地基三件套",
          duration: "1-2 个月",
          description:
            "网络基础（TCP/IP、HTTP 协议要能讲清楚三次握手）、Linux 常用命令、Python 脚本。",
        },
        {
          title: "Web 安全入门",
          duration: "2-3 个月",
          description:
            "从 OWASP Top 10 开始：SQL 注入、XSS、CSRF，跟着 PortSwigger Academy 的免费实验一个个做。",
        },
        {
          title: "CTF 实战练兵",
          duration: "持续",
          description:
            "picoCTF 入门 → BUUCTF 刷题 → 每周跟一场 CTFtime 的比赛，先玩转 Web 和 Misc 题。",
        },
        {
          title: "选择主攻方向",
          duration: "长期",
          description:
            "Web 安全 / 逆向 / pwn / 密码学 / 渗透测试，选一个深挖。安全领域不怕慢，就怕不深。",
        },
      ],
    },
  ],
  tips: [
    "每天写代码比每周突击更有效——哪怕只有 30 分钟。",
    "遇到报错先自己查 5 分钟，再把问题描述清楚去问人，这是成长最快的方式。",
    "教程看三遍不如自己敲一遍；敲一遍不如自己改一遍。",
    "每个阶段都要做一个能运行的小作品，积累成就感和项目经历。",
    "卡住超过两天的问题先跳过，学到后面回头看往往豁然开朗。",
  ],
};

const en: Roadmap = {
  tracks: [
    {
      key: "cpp",
      title: "C++ Track",
      goal: "Goal: master a demanding language that prepares you for algorithms, CS coursework and systems programming.",
      steps: [
        {
          title: "Set up your environment",
          duration: "1 day",
          description:
            "Install VS Code and MinGW (or another compiler) and get Hello World running.",
        },
        {
          title: "Language basics",
          duration: "4-8 weeks",
          description:
            "Variables, branches and loops, functions, arrays and strings. Follow learncpp.com chapters 1-12.",
        },
        {
          title: "Core C++",
          duration: "4-6 weeks",
          description:
            "Pointers and references, structs and classes, the STL (vector, map, string). This is where C++ gets real — type the examples out.",
        },
        {
          title: "Practice on a judge",
          duration: "ongoing",
          description:
            "Start with the easiest Exercism exercises, 5-10 problems a week.",
        },
        {
          title: "Build a small project",
          duration: "2-4 weeks",
          description:
            "A console project of your own: a grade manager, snake game or budgeting tool — learn to organize syntax into programs.",
        },
        {
          title: "Go deeper",
          duration: "long-term",
          description:
            "Work through C++ Primer, then data structures & algorithms (Hello Algo) — and decide between competitive programming and engineering.",
        },
      ],
    },
    {
      key: "python",
      title: "Python Track",
      goal: "Goal: start programming fast and solve real problems around you with scripts.",
      steps: [
        {
          title: "Set up your environment",
          duration: "1 day",
          description: "Install Python 3 and VS Code, learn to install packages with pip.",
        },
        {
          title: "Language basics",
          duration: "2-4 weeks",
          description:
            "Work through the official Python tutorial or CS50P, trying everything in the REPL as you go.",
        },
        {
          title: "Build small tools",
          duration: "2-4 weeks",
          description:
            "Rename files in bulk, scrape a webpage, automate an email — pick one real task. It teaches more than ten exercise sets.",
        },
        {
          title: "Pick a direction",
          duration: "long-term",
          description:
            "Data analysis (pandas), scraping (requests), web (Flask) or AI — go deep in one.",
        },
      ],
    },
    {
      key: "web",
      title: "Web Development Track",
      goal: "Goal: build pages and apps you can share with anyone.",
      steps: [
        {
          title: "HTML & CSS",
          duration: "2-4 weeks",
          description:
            "Learn tags and styling with MDN or freeCodeCamp; recreate any page you like pixel by pixel.",
        },
        {
          title: "JavaScript basics",
          duration: "4-8 weeks",
          description:
            "freeCodeCamp plus the Odin Project — master DOM manipulation and modern ES6 syntax.",
        },
        {
          title: "First real project",
          duration: "1-2 weeks",
          description:
            "Build a personal homepage or a small game, deploy it to Vercel or GitHub Pages, and share the link.",
        },
        {
          title: "Frameworks & engineering",
          duration: "long-term",
          description:
            "Learn React/Next.js (this site is built with it), Git collaboration and TypeScript on the way to full projects.",
        },
      ],
    },
    {
      key: "security",
      title: "Cybersecurity Track",
      goal: "Goal: solid networking and programming foundations, then real hands-on skill through CTFs and labs (always authorized).",
      steps: [
        {
          title: "The three foundations",
          duration: "1-2 months",
          description:
            "Networking basics (explain TCP/IP and HTTP properly), everyday Linux commands, and Python scripting.",
        },
        {
          title: "Web security basics",
          duration: "2-3 months",
          description:
            "Start from the OWASP Top 10: SQL injection, XSS, CSRF. Work through the free PortSwigger Academy labs.",
        },
        {
          title: "CTF practice",
          duration: "ongoing",
          description:
            "picoCTF first, then HackTheBox or TryHackMe. Join a CTFtime competition every week — start with Web and Misc.",
        },
        {
          title: "Pick a specialization",
          duration: "long-term",
          description:
            "Web security / reversing / pwn / crypto / pentesting — go deep in one. In security, depth beats breadth.",
        },
      ],
    },
  ],
  tips: [
    "Coding a little every day beats cramming once a week — even 30 minutes counts.",
    "Debug for 5 minutes on your own first, then ask with a clear problem description. That's the fastest way to grow.",
    "Watching three tutorials teaches less than typing one; typing one teaches less than modifying one.",
    "Finish a runnable little project at every stage — it builds both skill and a portfolio.",
    "If you're stuck for more than two days, skip it. Looking back later, things often click.",
  ],
};

const data: Record<Locale, Roadmap> = { zh, en };

export function getRoadmap(locale: Locale): Roadmap {
  return data[locale];
}
