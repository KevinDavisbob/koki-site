"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type Status = "idle" | "submitting" | "success" | "error";

/** 留言表单：POST /api/guestbook，成功后刷新页面数据 */
export function GuestbookForm() {
  const t = useTranslations("Guestbook");
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    setErrorText("");
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: data.get("nickname"),
          message: data.get("message"),
          website: data.get("website"),
          website2: data.get("website2"), // 蜜罐
        }),
      });
      if (res.status === 429) {
        setErrorText(t("error"));
        setStatus("error");
        return;
      }
      if (!res.ok || !(await res.json()).ok) {
        setErrorText(t("error"));
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
      router.refresh();
    } catch {
      setErrorText(t("error"));
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div>
        <label htmlFor="gb-nickname" className="mb-1.5 block text-sm font-medium">
          {t("nickname")}
        </label>
        <input
          id="gb-nickname"
          name="nickname"
          type="text"
          required
          maxLength={30}
          className="w-full rounded-lg border border-zinc-300 bg-transparent px-3.5 py-2.5 text-sm transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-700"
        />
      </div>
      <div>
        <label htmlFor="gb-message" className="mb-1.5 block text-sm font-medium">
          {t("message")}
        </label>
        <textarea
          id="gb-message"
          name="message"
          required
          maxLength={500}
          rows={4}
          className="w-full resize-y rounded-lg border border-zinc-300 bg-transparent px-3.5 py-2.5 text-sm transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-700"
        />
      </div>
      <div>
        <label htmlFor="gb-website" className="mb-1.5 block text-sm font-medium">
          {t("website")}
        </label>
        <input
          id="gb-website"
          name="website"
          type="text"
          maxLength={200}
          placeholder="https://"
          className="w-full rounded-lg border border-zinc-300 bg-transparent px-3.5 py-2.5 text-sm transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-700"
        />
      </div>
      {/* 蜜罐字段：对真人隐藏，机器人填了会被服务端静默丢弃 */}
      <input
        name="website2"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </button>
      {status === "success" && (
        <p className="text-sm text-green-600 dark:text-green-400">
          {t("success")}
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{errorText}</p>
      )}
    </form>
  );
}
