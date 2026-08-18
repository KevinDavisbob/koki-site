import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getGuestbookEntries } from "@/lib/guestbook";
import { toLocale } from "@/i18n/routing";
import { GuestbookForm } from "@/components/guestbook-form";

// 留言会通过 API 写入 GitHub，页面需要定期重新生成才能看到新内容
export const revalidate = 30;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/guestbook">): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = toLocale(locale) ?? "zh";
  const t = await getTranslations({ locale: validLocale, namespace: "Guestbook" });
  return { title: t("title"), description: t("description") };
}

export default async function GuestbookPage({
  params,
}: PageProps<"/[locale]/guestbook">) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  if (!locale) notFound();
  await setRequestLocale(locale);
  const t = await getTranslations("Guestbook");

  const entries = await getGuestbookEntries();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        {t("description")}
      </p>

      <GuestbookForm />

      <div className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight">
          {t("listTitle")}
          <span className="ml-2 text-sm font-normal text-zinc-400">
            ({entries.length})
          </span>
        </h2>
        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          {t("notice")}
        </p>
        <div className="mt-6 flex flex-col gap-4">
          {entries.length === 0 ? (
            <p className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              {t("empty")}
            </p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-semibold tracking-tight">
                    {entry.nickname}
                  </span>
                  <time
                    dateTime={entry.createdAt}
                    className="text-xs text-zinc-500 dark:text-zinc-400"
                  >
                    {new Intl.DateTimeFormat(
                      locale === "zh" ? "zh-CN" : "en-US",
                      { dateStyle: "medium", timeStyle: "short" },
                    ).format(new Date(entry.createdAt))}
                  </time>
                  {entry.website && (
                    <a
                      href={entry.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400"
                    >
                      {entry.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
                {/* 纯文本渲染（React 默认转义），防 XSS */}
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {entry.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
