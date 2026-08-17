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

export type SecurityTool = {
  name: string;
  description: string;
  url: string;
  category: string;
};

export type SecurityStage = {
  key: string;
  title: string;
  duration: string;
  learn: string[];
  practice: string[];
  milestone: string;
};

export type SecurityVuln = {
  name: string;
  what: string;
  defend: string;
};

export type CheatSheet = {
  title: string;
  rows: { item: string; usage: string }[];
};

export type SecurityContent = {
  intro: string;
  challengeLink: string;
  stages: SecurityStage[];
  roadmap: SecurityRoadmapStep[];
  vulns: SecurityVuln[];
  platforms: SecurityPlatform[];
  tools: SecurityTool[];
  cheats: CheatSheet[];
  ethics: string;
};

// 内容全部为教育性/防御性：CTF 竞赛与授权靶场是合法的学习方式
const zh: SecurityContent = {
  intro:
    "信息安全应用技术专业的自留地：学习路线、实战靶场和好玩的密码学工具。所有内容都在合法合规的框架内——CTF 竞赛、授权靶场和自己搭的环境。",
  challengeLink: "🎮 先玩个游戏：本站 CTF 迷你挑战（6 个 flag 等你找）→",
  stages: [
    {
      key: "stage0",
      title: "阶段 0 · 新手村",
      duration: "1 周",
      learn: [
        "搞清楚安全工程师到底做什么：攻防、研究、合规三条路",
        "背下三条红线：《网络安全法》、未授权测试=违法、白帽子思维",
        "玩一遍本站的 6 关 CTF 挑战，感受「找到隐藏信息」的乐趣",
      ],
      practice: [
        "完成[CTF 迷你挑战](/challenge)全部 6 关",
        "随便找一个网站，打开 F12 看看它的 HTML、请求和响应",
      ],
      milestone: "本站挑战 6/6 通关，并能向别人解释「flag 是什么」",
    },
    {
      key: "stage1",
      title: "阶段 1 · 地基三件套",
      duration: "1-2 个月",
      learn: [
        "网络基础：TCP 三次握手、HTTP 请求/响应报文每个字段的含义",
        "Linux：ls/cd/grep/chmod/nc 等 30 个常用命令，在虚拟机里装 Ubuntu",
        "Python：变量、流程、函数、requests 库——安全圈第一语言",
      ],
      practice: [
        "用 nc 和同学互发消息；用 curl 请求一个网站并逐行解释响应头",
        "写一个 Python 脚本：批量下载一个网站的前 10 张图片",
      ],
      milestone: "能不看笔记解释 HTTP 报文 + 独立写出可运行的小爬虫",
    },
    {
      key: "stage2",
      title: "阶段 2 · Web 安全入门",
      duration: "2-3 个月",
      learn: [
        "OWASP Top 10 十类漏洞的原理（见下方速览卡片）",
        "Burp Suite 抓包、改包、Repeater 重放",
        "靶场练习：DVWA（低→中难度全通）",
      ],
      practice: [
        "完成本站 SQL 注入与 XSS 两个动手实验",
        "PortSwigger Academy 免费实验室，每周至少 10 个",
      ],
      milestone: "独立完成 DVWA 全部低难度关卡，能讲清 SQLi 和 XSS 原理",
    },
    {
      key: "stage3",
      title: "阶段 3 · CTF 实战练兵",
      duration: "持续",
      learn: [
        "五大题型：Web / Reverse / Pwn / Crypto / Misc，从 Web 和 Misc 入手",
        "常用工具链：CyberChef、Wireshark、Ghidra 逐个上手",
        "看 Writeup：卡住的题看完题解必须复现一遍",
      ],
      practice: [
        "picoCTF 新手题全刷，然后转 BUUCTF",
        "每周跟一场 CTFtime 上的比赛，目标：独立解出 3 题",
      ],
      milestone: "在一场正式比赛中独立解出 3 题并有自己的 Writeup",
    },
    {
      key: "stage4",
      title: "阶段 4 · 选定主攻方向",
      duration: "3-6 个月",
      learn: [
        "四条主路选一：Web 安全 / 逆向工程 / 二进制漏洞 Pwn / 渗透测试",
        "选定方向后系统学习：Web→PortSwigger 全部课程；逆向→《加密与解密》",
        "跟着 CVE 公告复现 1-2 个真实历史漏洞（在本地环境）",
      ],
      practice: [
        "完成方向对应的「代表作」：一篇深度漏洞分析或一个自研工具",
        "参加国内 SRC（漏洞响应平台）的公益测试项目（合法授权）",
      ],
      milestone: "产出第一个代表作：复现报告 / 自研工具 / 深度技术文章",
    },
    {
      key: "stage5",
      title: "阶段 5 · 入土（进阶研究）",
      duration: "长期",
      learn: [
        "漏洞挖掘方法论：代码审计、Fuzz 测试、协议分析",
        "安全开发：写出别人攻不破的代码（SDL 安全开发生命周期）",
        "红队视角：内网渗透、免杀、云安全——永远在授权框架内",
      ],
      practice: [
        "在开源项目里挖掘真实漏洞并负责任地提交",
        "申请 CVE 编号，或成为 SRC 平台核心白帽子",
      ],
      milestone: "挖到第一个被官方确认的漏洞——正式「入土」",
    },
  ],
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
  tools: [
    {
      name: "Burp Suite",
      description: "Web 渗透测试的事实标准：抓包、改包、重放、扫描器一应俱全。社区版免费。",
      url: "https://portswigger.net/burp",
      category: "Web 安全",
    },
    {
      name: "CyberChef",
      description: "GCHQ 出品的「网络瑞士军刀」：Base64、凯撒、进制转换，几百种操作随意组合。",
      url: "https://gchq.github.io/CyberChef/",
      category: "编码转换",
    },
    {
      name: "Wireshark",
      description: "最流行的流量分析工具，抓包看协议细节，Misc 题和网络排查必备。",
      url: "https://www.wireshark.org",
      category: "流量分析",
    },
    {
      name: "Nmap",
      description: "端口扫描与主机发现的标准工具，网络侦察第一步。",
      url: "https://nmap.org",
      category: "侦察",
    },
    {
      name: "Kali Linux",
      description: "预装数百种安全工具的渗透测试发行版，建议装在虚拟机里玩。",
      url: "https://www.kali.org",
      category: "系统",
    },
    {
      name: "Ghidra",
      description: "NSA 开源的逆向工程套件，反汇编和反编译的神器，逆向题入门必装。",
      url: "https://ghidra-sre.org",
      category: "逆向",
    },
    {
      name: "John the Ripper",
      description: "经典密码破解工具，用于 CTF 密码学题和密码强度教育。",
      url: "https://www.openwall.com/john/",
      category: "密码",
    },
    {
      name: "Metasploit",
      description: "漏洞利用框架，渗透测试流程自动化——仅限授权环境使用。",
      url: "https://www.metasploit.com",
      category: "渗透测试",
    },
  ],
  vulns: [
    {
      name: "SQL 注入",
      what: "用户输入被拼进 SQL 语句执行，可绕过登录、拖库。",
      defend: "参数化查询/预编译语句",
    },
    {
      name: "XSS 跨站脚本",
      what: "用户输入被当作 HTML 渲染，可窃取 Cookie、钓鱼。",
      defend: "输出 HTML 实体编码 + CSP",
    },
    {
      name: "CSRF 跨站请求伪造",
      what: "诱导受害者浏览器发送伪造请求，冒充其身份操作。",
      defend: "CSRF Token + SameSite Cookie",
    },
    {
      name: "SSRF 服务端请求伪造",
      what: "诱导服务器发起恶意请求，探测内网、读取元数据。",
      defend: "请求地址白名单校验",
    },
    {
      name: "文件上传漏洞",
      what: "上传点过滤不严，传马拿 shell。",
      defend: "白名单校验扩展名与 MIME + 重命名 + 隔离存储",
    },
    {
      name: "XXE 外部实体注入",
      what: "解析 XML 时引入外部实体，读文件、打内网。",
      defend: "禁用外部实体解析",
    },
    {
      name: "不安全的反序列化",
      what: "反序列化恶意对象触发代码执行。",
      defend: "校验来源 + 白名单类型 + 数字签名",
    },
    {
      name: "IDOR 越权访问",
      what: "改个 id 参数就能看别人的数据。",
      defend: "服务端对象级权限校验",
    },
    {
      name: "命令注入",
      what: "输入拼接进系统命令，可执行任意指令。",
      defend: "白名单参数 + 避免 shell 拼接",
    },
    {
      name: "弱认证与暴力破解",
      what: "弱口令、无速率限制，被爆破/撞库。",
      defend: "强密码策略 + MFA + 登录限速",
    },
  ],
  cheats: [
    {
      title: "Linux 命令速查",
      rows: [
        { item: "ls -la / cd / pwd", usage: "看文件、切换目录、我在哪" },
        { item: "grep -r \"flag\" .", usage: "递归搜索文件内容（找 flag 神器）" },
        { item: "find / -name \"*.txt\" 2>/dev/null", usage: "按名字找文件" },
        { item: "nc -l -p 4444 / nc host 4444", usage: "监听/连接端口，聊天传文件" },
        { item: "chmod +x file / chmod 755", usage: "给文件执行权限" },
        { item: "file / strings / binwalk", usage: "识别文件类型 / 提取字符串 / 分析固件" },
        { item: "ss -tlnp / ps aux", usage: "看端口监听 / 看进程" },
        { item: "history | grep curl", usage: "翻历史命令（题里常见考点）" },
      ],
    },
    {
      title: "编码识别速查",
      rows: [
        { item: "以 = 结尾的字母数字串", usage: "大概率 Base64" },
        { item: "0x 开头 / 纯 0-9A-F", usage: "十六进制" },
        { item: "含 %20 %2F 这类", usage: "URL 编码" },
        { item: "由 . 和 - 组成", usage: "摩斯电码" },
        { item: "字母但读不懂，像差几位的英文", usage: "凯撒密码（试 25 种偏移）或 ROT13" },
        { item: "iodj~{ 这种看不出规律", usage: "先猜凯撒/维吉尼亚，再用词频分析" },
        { item: "png 头 89 50 4E 47 / zip 头 50 4B", usage: "文件头（file 命令更省事）" },
        { item: "QQ== 这种短 Base64", usage: "解码后再看——可能套了多层编码" },
      ],
    },
    {
      title: "工具速查",
      rows: [
        { item: "curl -I URL", usage: "只看响应头" },
        { item: "nmap -sV -p 1-1000 host", usage: "扫端口和服务版本（仅授权目标）" },
        { item: "gobuster dir -u URL -w wordlist", usage: "目录爆破" },
        { item: "john --wordlist=rockyou.txt hash", usage: "密码哈希破解" },
        { item: "binwalk -e file / foremost file", usage: "从文件里提取隐藏文件" },
        { item: "zsteg image.png", usage: "图片隐写检测（LSB 隐写）" },
        { item: "CyberChef From Base64 → XOR → …", usage: "编码解码流水线" },
        { item: "浏览器 F12 → Network", usage: "一切 Web 题的开始" },
      ],
    },
  ],
  ethics:
    "⚠️ 安全技能请只在授权环境使用：CTF 平台、靶场、你自己搭的虚拟机。未经授权对任何真实系统进行扫描或渗透都是违法的。做「白帽子」，别做「小黑子」。",
};

const en: SecurityContent = {
  intro:
    "Home turf for an Information Security major: a learning path, practice platforms, and fun crypto tools — all within legal and ethical bounds: CTF competitions, authorized labs and your own sandbox.",
  challengeLink: "🎮 Warm up with a game first: a mini CTF on this site (6 flags to find) →",
  stages: [
    {
      key: "stage0",
      title: "Stage 0 · Starting village",
      duration: "1 week",
      learn: [
        "What security engineers actually do: offense, research, compliance — three paths",
        "Memorize three red lines: the law, unauthorized testing is illegal, white-hat mindset",
        "Play this site's 6-level CTF challenge and feel the joy of finding hidden info",
      ],
      practice: [
        "Clear all 6 levels of the [mini CTF](/challenge)",
        "Open F12 on any website and explore its HTML, requests and responses",
      ],
      milestone: "6/6 challenge flags, and you can explain to someone what a flag is",
    },
    {
      key: "stage1",
      title: "Stage 1 · The three foundations",
      duration: "1-2 months",
      learn: [
        "Networking: the TCP handshake, every field of an HTTP request/response",
        "Linux: 30 everyday commands (ls/cd/grep/chmod/nc) — install Ubuntu in a VM",
        "Python: variables, control flow, functions, requests — security's first language",
      ],
      practice: [
        "Chat with a classmate over nc; request a website with curl and explain every response header",
        "Write a Python script that downloads the first 10 images from a website",
      ],
      milestone: "Explain an HTTP message without notes + a runnable scraper of your own",
    },
    {
      key: "stage2",
      title: "Stage 2 · Web security basics",
      duration: "2-3 months",
      learn: [
        "The OWASP Top 10 vulnerability classes (see the cards below)",
        "Burp Suite: intercept, modify, replay",
        "Labs: DVWA low→medium, all challenges",
      ],
      practice: [
        "Complete this site's SQL injection and XSS hands-on labs",
        "PortSwigger Academy free labs — at least 10 per week",
      ],
      milestone: "All DVWA low-level challenges solo, and you can explain SQLi and XSS",
    },
    {
      key: "stage3",
      title: "Stage 3 · CTF practice",
      duration: "ongoing",
      learn: [
        "The five categories: Web / Reverse / Pwn / Crypto / Misc — start with Web and Misc",
        "The toolchain: CyberChef, Wireshark, Ghidra, one at a time",
        "Writeups: every stuck challenge gets read AND reproduced",
      ],
      practice: [
        "Finish picoCTF's beginner problems, then move to platforms like HackTheBox",
        "Join a CTFtime event weekly — goal: 3 challenges solved solo",
      ],
      milestone: "3 solo solves in an official competition, with your own writeup",
    },
    {
      key: "stage4",
      title: "Stage 4 · Pick your specialization",
      duration: "3-6 months",
      learn: [
        "Choose one road: Web security / reverse engineering / binary exploitation / pentesting",
        "Study systematically: Web→all of PortSwigger; reversing→classic books",
        "Reproduce 1-2 historical CVEs locally, following the advisories",
      ],
      practice: [
        "Produce a 'signature work': a deep vulnerability analysis or a self-built tool",
        "Join authorized SRC (vulnerability response platform) testing programs",
      ],
      milestone: "Your first signature work: a report, a tool, or a deep technical article",
    },
    {
      key: "stage5",
      title: "Stage 5 · Going deep (the grave)",
      duration: "long-term",
      learn: [
        "Vulnerability discovery: code auditing, fuzzing, protocol analysis",
        "Secure development: write code others can't break (SDL)",
        "Red-team view: internal networks, evasion, cloud security — always authorized",
      ],
      practice: [
        "Find real bugs in open-source projects and disclose responsibly",
        "Earn a CVE, or become a top white hat on an SRC platform",
      ],
      milestone: "Your first officially confirmed vulnerability — officially 'in the grave'",
    },
  ],
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
  tools: [
    {
      name: "Burp Suite",
      description: "The de-facto standard for web pentesting: intercept, modify, replay, scan. Community edition is free.",
      url: "https://portswigger.net/burp",
      category: "Web",
    },
    {
      name: "CyberChef",
      description: "GCHQ's 'Cyber Swiss Army Knife': Base64, Caesar, encodings — hundreds of operations you can chain.",
      url: "https://gchq.github.io/CyberChef/",
      category: "Encoding",
    },
    {
      name: "Wireshark",
      description: "The most popular traffic analyzer — essential for forensics and network troubleshooting.",
      url: "https://www.wireshark.org",
      category: "Traffic",
    },
    {
      name: "Nmap",
      description: "The standard tool for port scanning and host discovery — the first step of recon.",
      url: "https://nmap.org",
      category: "Recon",
    },
    {
      name: "Kali Linux",
      description: "A pentesting distro with hundreds of tools preinstalled — run it in a VM.",
      url: "https://www.kali.org",
      category: "OS",
    },
    {
      name: "Ghidra",
      description: "NSA's open-source reverse-engineering suite — must-have for reverse challenges.",
      url: "https://ghidra-sre.org",
      category: "Reversing",
    },
    {
      name: "John the Ripper",
      description: "The classic password cracker — for CTF crypto and password-strength education.",
      url: "https://www.openwall.com/john/",
      category: "Passwords",
    },
    {
      name: "Metasploit",
      description: "An exploitation framework that automates pentest workflows — authorized environments only.",
      url: "https://www.metasploit.com",
      category: "Pentest",
    },
  ],
  vulns: [
    {
      name: "SQL Injection",
      what: "User input is concatenated into SQL — bypass logins, dump databases.",
      defend: "Parameterized queries / prepared statements",
    },
    {
      name: "XSS (Cross-Site Scripting)",
      what: "User input rendered as HTML — steal cookies, phish.",
      defend: "HTML-entity-encode output + CSP",
    },
    {
      name: "CSRF",
      what: "Trick the victim's browser into forged requests acting as them.",
      defend: "CSRF tokens + SameSite cookies",
    },
    {
      name: "SSRF",
      what: "Make the server fetch malicious URLs — probe internals, read metadata.",
      defend: "Allowlist validation of request targets",
    },
    {
      name: "File upload flaws",
      what: "Lax upload filters — plant a webshell.",
      defend: "Allowlist extension/MIME + rename + isolated storage",
    },
    {
      name: "XXE (XML External Entities)",
      what: "External entities in XML parsing — read files, hit internal networks.",
      defend: "Disable external entity resolution",
    },
    {
      name: "Insecure deserialization",
      what: "Deserializing malicious objects triggers code execution.",
      defend: "Validate sources + type allowlists + signatures",
    },
    {
      name: "IDOR (broken access control)",
      what: "Change an id parameter and read someone else's data.",
      defend: "Server-side object-level authorization",
    },
    {
      name: "Command injection",
      what: "Input concatenated into shell commands — arbitrary execution.",
      defend: "Allowlist parameters + avoid shell concatenation",
    },
    {
      name: "Weak auth & brute force",
      what: "Weak passwords and no rate limits — cracked or credential-stuffed.",
      defend: "Password policy + MFA + login throttling",
    },
  ],
  cheats: [
    {
      title: "Linux commands",
      rows: [
        { item: "ls -la / cd / pwd", usage: "List files, move around, where am I" },
        { item: "grep -r \"flag\" .", usage: "Recursive content search (the flag-finder)" },
        { item: "find / -name \"*.txt\" 2>/dev/null", usage: "Find files by name" },
        { item: "nc -l -p 4444 / nc host 4444", usage: "Listen/connect — chat and file transfer" },
        { item: "chmod +x file / chmod 755", usage: "Make a file executable" },
        { item: "file / strings / binwalk", usage: "Identify file type / extract strings / analyze firmware" },
        { item: "ss -tlnp / ps aux", usage: "Open ports / running processes" },
        { item: "history | grep curl", usage: "Dig through command history (a classic challenge trick)" },
      ],
    },
    {
      title: "Encoding recognition",
      rows: [
        { item: "Letters and digits ending with =", usage: "Probably Base64" },
        { item: "Starts with 0x / only 0-9A-F", usage: "Hexadecimal" },
        { item: "Contains %20, %2F…", usage: "URL encoding" },
        { item: "Made of dots and dashes", usage: "Morse code" },
        { item: "Letters that look shifted by a few places", usage: "Caesar (try 25 offsets) or ROT13" },
        { item: "No visible pattern", usage: "Try Caesar/Vigenère, then frequency analysis" },
        { item: "PNG header 89 50 4E 47 / ZIP header 50 4B", usage: "File magic (the file command is easier)" },
        { item: "Short Base64 like QQ==", usage: "Decode, then look again — encodings nest" },
      ],
    },
    {
      title: "Tools",
      rows: [
        { item: "curl -I URL", usage: "Response headers only" },
        { item: "nmap -sV -p 1-1000 host", usage: "Ports and service versions (authorized targets only)" },
        { item: "gobuster dir -u URL -w wordlist", usage: "Directory brute force" },
        { item: "john --wordlist=rockyou.txt hash", usage: "Password hash cracking" },
        { item: "binwalk -e file / foremost file", usage: "Extract hidden files" },
        { item: "zsteg image.png", usage: "Image steganography (LSB) detection" },
        { item: "CyberChef: From Base64 → XOR → …", usage: "Encoding pipelines" },
        { item: "Browser F12 → Network", usage: "The start of every web challenge" },
      ],
    },
  ],
  ethics:
    "⚠️ Use security skills only in authorized environments: CTF platforms, labs, and VMs you own. Scanning or attacking real systems without permission is illegal. Be a white hat.",
};

const data: Record<Locale, SecurityContent> = { zh, en };

export function getSecurityContent(locale: Locale): SecurityContent {
  return data[locale];
}
