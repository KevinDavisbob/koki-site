import type { Locale } from "@/i18n/routing";

export type SecurityRoadmapStep = {
  title: string;
  duration: string;
  description: string;
};

export type SecurityPlatform = {
  title: string;
  description: string;
  url: string;
  tag: string;
};

export type SecurityContent = {
  intro: string;
  challengeLink: string;
  roadmap: SecurityRoadmapStep[];
  platforms: SecurityPlatform[];
  ethics: string;
};

// 内容全部为教育性/防御性：CTF 竞赛与授权靶场是合法的学习方式
const zh: SecurityContent = {
  intro:
    "信息安全应用技术专业的自留地：学习路线、实战靶场和好玩的密码学工具。所有内容都在合法合规的框架内——CTF 竞赛、授权靶场和自己搭的环境。",
  challengeLink: "🎮 先玩个游戏：本站 CTF 迷你挑战（3 个 flag 等你找）→",
  roadmap: [
    {
      title: "地基三件套",
      duration: "1-2 个月",
      description:
        "网络基础（TCP/IP、HTTP 协议要能讲清楚三次握手）、Linux 常用命令、Python 脚本。没有这三样，后面的都是空中楼阁。",
    },
    {
      title: "Web 安全入门",
      duration: "2-3 个月",
      description:
        "从 OWASP Top 10 开始：SQL 注入、XSS、CSRF、文件上传。跟着 PortSwigger Academy 的免费实验一个个做，配 Burp Suite 抓包练习。",
    },
    {
      title: "CTF 实战练兵",
      duration: "持续",
      description:
        "picoCTF 入门，然后转到 BUUCTF 刷题。每周跟一场 CTFtime 上的比赛，先从 Web 和 Misc 题下手建立信心。",
    },
    {
      title: "选择主攻方向",
      duration: "长期",
      description:
        "Web 安全 / 逆向工程 / 二进制漏洞(pwn) / 密码学(crypto) / 渗透测试，选一个深挖。安全领域不怕走得慢，就怕不深。",
    },
    {
      title: "红线永远在心",
      duration: "终身",
      description:
        "只在 CTF 平台、授权靶场、自己搭的环境里练习。《网络安全法》是底线，技术是用来保护而不是破坏的。",
    },
  ],
  platforms: [
    {
      title: "picoCTF",
      description: "卡内基梅隆大学办的入门 CTF，题目从易到难，零基础友好。",
      url: "https://picoctf.org",
      tag: "入门比赛",
    },
    {
      title: "BUUCTF",
      description: "国内最活跃的 CTF 刷题平台，题目全、题解多。",
      url: "https://buuoj.cn",
      tag: "刷题",
    },
    {
      title: "CTF Wiki",
      description: "CTF 百科全书：Web、逆向、pwn、密码学各个方向的知识库。",
      url: "https://ctf-wiki.org",
      tag: "知识库",
    },
    {
      title: "PortSwigger Web Security Academy",
      description: "Burp Suite 官方出的免费 Web 安全实战课，业界口碑第一。",
      url: "https://portswigger.net/web-security",
      tag: "Web 实战",
    },
    {
      title: "TryHackMe",
      description: "互动式攻防学习平台，浏览器里就能开靶机，闯关式学习。",
      url: "https://tryhackme.com",
      tag: "靶场",
    },
    {
      title: "CTFtime",
      description: "全球 CTF 赛事日历，找比赛、看题解、追排行榜。",
      url: "https://ctftime.org",
      tag: "赛事日历",
    },
  ],
  ethics:
    "⚠️ 安全技能请只在授权环境使用：CTF 平台、靶场、你自己搭的虚拟机。未经授权对任何真实系统进行扫描或渗透都是违法的。做「白帽子」，别做「小黑子」。",
};

const en: SecurityContent = {
  intro:
    "Home turf for an Information Security major: a learning path, practice platforms, and fun crypto tools — all within legal and ethical bounds: CTF competitions, authorized labs and your own sandbox.",
  challengeLink: "🎮 Warm up with a game first: a mini CTF on this site (3 flags to find) →",
  roadmap: [
    {
      title: "The three foundations",
      duration: "1-2 months",
      description:
        "Networking basics (be able to explain TCP/IP and HTTP properly), everyday Linux commands, and Python scripting. Everything else is castles in the air without these.",
    },
    {
      title: "Web security basics",
      duration: "2-3 months",
      description:
        "Start from the OWASP Top 10: SQL injection, XSS, CSRF, file upload. Work through the free PortSwigger Academy labs with Burp Suite as your sidekick.",
    },
    {
      title: "CTF practice",
      duration: "ongoing",
      description:
        "Start with picoCTF, then move to platforms like HackTheBox or TryHackMe. Join a competition from CTFtime every week — begin with Web and Misc challenges.",
    },
    {
      title: "Pick a specialization",
      duration: "long-term",
      description:
        "Web security / reverse engineering / binary exploitation (pwn) / cryptography / pentesting — go deep in one. In security, depth beats breadth.",
    },
    {
      title: "Stay on the right side",
      duration: "lifelong",
      description:
        "Practice only on CTF platforms, authorized labs, and your own environments. Technology protects — it doesn't break.",
    },
  ],
  platforms: [
    {
      title: "picoCTF",
      description: "CMU's beginner-friendly CTF with a gentle difficulty curve.",
      url: "https://picoctf.org",
      tag: "Starter CTF",
    },
    {
      title: "HackTheBox",
      description: "The classic hacker playground — real machines, real skills.",
      url: "https://www.hackthebox.com",
      tag: "Lab",
    },
    {
      title: "PortSwigger Web Security Academy",
      description: "Free hands-on web security courses from the makers of Burp Suite.",
      url: "https://portswigger.net/web-security",
      tag: "Web",
    },
    {
      title: "TryHackMe",
      description: "Guided, interactive learning paths with in-browser machines.",
      url: "https://tryhackme.com",
      tag: "Lab",
    },
    {
      title: "OverTheWire",
      description: "The Bandit wargame is the classic first step into Linux and security.",
      url: "https://overthewire.org",
      tag: "Wargame",
    },
    {
      title: "CTFtime",
      description: "The global CTF calendar — competitions, writeups, rankings.",
      url: "https://ctftime.org",
      tag: "Calendar",
    },
  ],
  ethics:
    "⚠️ Use security skills only in authorized environments: CTF platforms, labs, and VMs you own. Scanning or attacking real systems without permission is illegal. Be a white hat.",
};

const data: Record<Locale, SecurityContent> = { zh, en };

export function getSecurityContent(locale: Locale): SecurityContent {
  return data[locale];
}
