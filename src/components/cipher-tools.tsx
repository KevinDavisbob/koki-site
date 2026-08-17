"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// 所有运算都在浏览器本地完成，不上传任何数据
export function CipherTools() {
  const t = useTranslations("Security");
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CaesarTool t={t} />
      <Base64Tool t={t} />
      <Sha256Tool t={t} />
    </div>
  );
}

function ToolCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-500 dark:border-zinc-700";

function Output({ value, placeholder }: { value: string; placeholder: string }) {
  return (
    <div className="w-full break-all rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
      {value || <span className="text-zinc-400">{placeholder}</span>}
    </div>
  );
}

function CaesarTool({ t }: { t: ReturnType<typeof useTranslations<"Security">> }) {
  const [text, setText] = useState("");
  const [shift, setShift] = useState(3);

  // 凯撒密码：字母按偏移循环移位（兼容中文字符不动）
  function caesar(input: string, s: number) {
    const n = ((s % 26) + 26) % 26;
    return input.replace(/[a-zA-Z]/g, (ch) => {
      const base = ch <= "Z" ? 65 : 97;
      return String.fromCharCode(base + ((ch.charCodeAt(0) - base + n) % 26));
    });
  }

  return (
    <ToolCard title={t("caesarTitle")} hint={t("caesarHint")}>
      <input
        className={inputCls}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("caesarPlaceholder")}
      />
      <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t("caesarShift")}
        <input
          type="range"
          min={1}
          max={25}
          value={shift}
          onChange={(e) => setShift(Number(e.target.value))}
          className="flex-1 accent-indigo-600"
        />
        <span className="w-6 text-right tabular-nums">{shift}</span>
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setText(caesar(text, shift))}
          className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          {t("caesarEncrypt")}
        </button>
        <button
          type="button"
          onClick={() => setText(caesar(text, -shift))}
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          {t("caesarDecrypt")}
        </button>
      </div>
      <Output value={caesar(text, shift)} placeholder={t("caesarPlaceholder")} />
    </ToolCard>
  );
}

function Base64Tool({ t }: { t: ReturnType<typeof useTranslations<"Security">> }) {
  const [text, setText] = useState("");
  const [encoded, setEncoded] = useState("");

  function toBase64(input: string) {
    try {
      // 正确处理中文字符
      const bytes = new TextEncoder().encode(input);
      let bin = "";
      bytes.forEach((b) => (bin += String.fromCharCode(b)));
      return btoa(bin);
    } catch {
      return "";
    }
  }

  function fromBase64(input: string) {
    try {
      const bin = atob(input);
      const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    } catch {
      return "⚠️ 无效的 Base64";
    }
  }

  return (
    <ToolCard title={t("base64Title")} hint={t("base64Hint")}>
      <input
        className={inputCls}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("base64Placeholder")}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setEncoded(toBase64(text))}
          className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          {t("base64Encode")}
        </button>
        <button
          type="button"
          onClick={() => setText(fromBase64(encoded))}
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          {t("base64Decode")}
        </button>
      </div>
      <Output value={encoded} placeholder={t("base64Placeholder")} />
    </ToolCard>
  );
}

function Sha256Tool({ t }: { t: ReturnType<typeof useTranslations<"Security">> }) {
  const [text, setText] = useState("");
  const [hash, setHash] = useState("");

  async function digest(input: string) {
    const data = new TextEncoder().encode(input);
    const buf = await crypto.subtle.digest("SHA-256", data);
    setHash([...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join(""));
  }

  return (
    <ToolCard title={t("sha256Title")} hint={t("sha256Hint")}>
      <input
        className={inputCls}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("sha256Placeholder")}
        onKeyDown={(e) => e.key === "Enter" && digest(text)}
      />
      <button
        type="button"
        onClick={() => digest(text)}
        className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
      >
        {t("sha256Digest")}
      </button>
      <Output value={hash} placeholder={t("sha256Placeholder")} />
    </ToolCard>
  );
}
