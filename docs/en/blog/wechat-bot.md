---
title: "Putting an AI in a WeChat Group: Screenshots, OCR, and Coordinate Clicks"
date: "2026-08-19"
description: "A project retrospective: WeChat 4.x has no usable automation interface, so I built a group-chat AI assistant the only way left — screenshots for eyes, OCR for reading, and Win32 messages for hands."
tags: ["Projects", "Python", "Automation"]
---

A few days ago I built an AI assistant for a WeChat group: mention it, and it generates a reply with DeepSeek and sends it automatically. Simple feature, but WeChat 4.x has blocked nearly every "proper" automation route — so the project took a hacky, fascinating detour. Here's the full story and every pitfall.

## Wall #1: no interface

The popular approaches to WeChat bots — itchat, wechaty and friends — are all **protocol interfaces**. Two problems:

1. Unofficial protocols break whenever WeChat ships an update
2. Account-ban risk

And the "official" route? WeChat has no automation API for personal accounts.

That leaves exactly one path: **simulate how a human uses WeChat**. Humans look at the screen and click with the mouse — so the machine screenshots for eyes and fakes clicks for hands.

## Wall #2: an empty UIA tree

The standard Windows UI-automation approach is UIA (UI Automation) — crawl the window's element tree like a scraper, find the "message list" control, read its text. But WeChat 4.x is a Qt custom-drawn UI, and its **UIA tree is nearly empty**: no messages to read anywhere.

With that route dead, the design became obvious: **screenshot + OCR**.

```python
# The core loop: see → think → speak
while True:
    screen = capture_window(hwnd)          # see: screenshot the WeChat window
    messages = ocr.extract_bubbles(screen) # think: OCR the chat bubbles
    new = [m for m in messages if m.side == "left" and m.id not in seen]
    for m in new:                          # speak: generate and send replies
        reply = deepseek.chat(m.text)
        send_message(hwnd, reply)
    time.sleep(3)
```

Key design decisions:

- **Left/right bubble separation**: your own messages sit on the right, everyone else's on the left. OCR classifies bubbles by x-coordinate; your own are ignored — otherwise the bot talks to itself forever.
- **Dedup**: every message gets an id (text + position + time) so the same message is never answered twice.
- **Layering**: perception (screenshot/OCR), decision (reply generation), and action (click/type) are separate modules, so each stage debugs independently.

## Details you only learn by falling into them

**Mouse wheel events only go to the focused window.** Simulating `mouse_event` wheel scrolling does nothing when WeChat isn't in the foreground. The fix: send the message directly to WeChat's window handle.

```python
import ctypes
# WM_MOUSEWHEEL: bypass focus entirely, deliver straight to the target window
wParam = (120 << 16)  # +120 = scroll up three notches
ctypes.windll.user32.PostMessageW(hwnd, 0x020A, wParam, 0)
```

`PostMessage` neither waits for the window nor needs focus — exactly what we need.

**The chat area white-screens for ~2 seconds after clicking a conversation.** Every time you switch chats, the pane re-renders for about two seconds, during which screenshots capture nothing but white. So after switching, don't OCR immediately — **poll and verify**: wait, then check the title bar shows the target conversation before continuing. Unreliable perception must come with verification, or you'll be reading blankness.

**While the bot runs, the WeChat window must stay visible and the mouse untouched.** Coordinate clicks have no intelligence — move the window and they land somewhere else. This makes the bot a single-machine, hands-off-the-keyboard project by nature.

## Engineering judgment calls

Debugging makes it very easy to slip a half-baked reply into the group chat, so I built in a few modes:

```bash
python bot.py            # real run (actually sends)
python bot.py --dry-run  # generate replies only, print to terminal
python bot.py --shot     # save one screenshot for OCR debugging
python bot.py --dump     # dump current state
```

`--dry-run` turned out to be the most valuable flag: **make side effects controllable**. When automating against a real environment, go read-only first, log-only second, and only then truly execute.

## So is this approach any good?

Honestly: **fragile**.

- WeChat ships one redesign (even a bubble corner-radius tweak) and every OCR template and coordinate needs re-tuning
- Slow: screenshot + OCR + render-waiting means seconds of latency per reply
- Ugly: the window must stay visible, so you can't use that machine for anything else

But it has one big virtue: **it touches no protocol and no account-security boundary**. Every action is "a user doing things they can see with their own account" — no injection, no spoofing, no ban risk. For a learning project, that beats elegance.

## Takeaways and next steps

The biggest gains from this project weren't the bot itself:

1. **Windows messaging**: `PostMessage` vs `SendMessage`, focus and message routing — the same foundations behind reverse engineering and malware analysis
2. **Turning unreliable perception into a reliable state machine**: screenshots fail, OCR misreads, rendering takes time — engineering is adding verification to every step
3. **Controlling side effects**: the dry-run mindset — every automation should be "previewable" first

Next up: a vision model reading whole screenshots directly (no more OCR template maintenance), a multi-group message queue, and reconnect handling.

If this kind of human-machine automation interests you, the [Python and tooling stage](/en/roadmap) of the security roadmap is a great next step — and understanding window messages pays off directly in malware analysis later.
