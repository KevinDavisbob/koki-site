---
title: "One Month Into Security: The Three Lessons That Mattered Most"
date: "2026-08-19"
description: "An essay: from SQL injection to my first XSS payload, from launching this blog to building a WeChat bot — a month of learning boiled down to three lines that beat any payload list."
tags: ["Essay", "Learning"]
---

This blog is two weeks old, and the security posts are piling up. Looking back at the month — from "I don't even know what a vulnerability is" to writing [SQL injection 101](/en/blog/sql-injection) and [XSS 101](/en/blog/xss-intro) — the biggest gain wasn't the payloads I memorized. It was three sentences.

## 1. Understand how a system works before you learn how to break it

When I started, what I wanted most was "how to hack a website" — as if security were some kind of magic running parallel to programming.

I've since realized that [SQL injection](/en/blog/sql-injection) isn't a "hacker trick" at its core; it's **understanding how a SQL query gets assembled**. XSS is understanding **how a browser tells data from code**. Never having written a backend or touched a frontend, these vulnerabilities are just legends from other people's posts; once you've written the terrible string-concatenation code yourself, the vulnerability becomes *obvious*.

Security is built on understanding systems. Without that foundation, memorizing payloads is just copying.

## 2. Output is the best way to learn

The best decision I made this month was **writing down what I learned**.

- Writing [Crypto 101](/en/blog/crypto-intro), I discovered I couldn't actually explain the difference between hashing and encryption — so I went back and relearned it
- To build an interactive demo for my articles, I wrote a fake login box and verified with my own hands how `' OR '1'='1` actually bypasses authentication
- Building this blog itself was a full project in miniature: i18n, deployment, SEO

Teaching is a mirror. The parts you can't explain are the parts you haven't learned.

## 3. Hacky paths are fine — as long as you know you're on one

The most exciting project lately was the [WeChat group AI assistant](/en/blog/wechat-bot): no interface? Screenshot + OCR + simulated clicks, touching no protocol and no security boundary.

"Something this fragile — what's the point?" My answer: it forced me to understand Windows message routing, focus mechanics, and render timing — the exact foundations of future malware analysis. **Tools are amplifiers, not shortcuts.** When the proper approach gets you nowhere, the hacky path is how you build fundamentals.

## Closing

A month ago I was still agonizing over "what order should I learn security in". Now I know: **write code before hunting bugs; output before hoarding; build before polishing.**

If you're starting out too, the [full roadmap](/en/blog/en/security-roadmap-full) is the map we drew — but you still have to walk it yourself. Good luck to us both.
