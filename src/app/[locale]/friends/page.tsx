import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getFriends } from "@/lib/friends";
import { toLocale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/friends">): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = toLocale(locale) ?? "zh";
  const t = await getTranslations({ locale: validLocale, namespace: "Friends" });
  return { title: t("title"), description: t("description") };
}

export default async function FriendsPage({
  params,
}: PageProps<"/[locale]/friends">) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  if (!locale) notFound();
  await setRequestLocale(locale);
  const t = await getTranslations("Friends");

  const friends = getFriends();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        {t("description")}
      </p>

      {friends.length === 0 ? (
        <p className="mt-16 text-center text-zinc-500 dark:text-zinc-400">
          {t("empty")}
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {friends.map((friend) => (
            <a
              key={friend.url}
              href={friend.url}
              target="_blank"
              rel="noreferrer"
              className="group block rounded-xl border border-zinc-200 p-5 transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:hover:border-indigo-700"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xl dark:bg-zinc-800"
                  aria-hidden="true"
                >
                  {friend.emoji}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-semibold tracking-tight transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {friend.name}
                  </h2>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {friend.url.replace(/^https?:\/\//, "")}
                  </p>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                {friend.description}
              </p>
            </a>
          ))}
        </div>
      )}

      <div className="mt-16 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-lg font-semibold tracking-tight">
          {t("applyTitle")}
        </h2>
        <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          {t("applyHintPrefix")}{" "}
          <a
            href={`mailto:${siteConfig.social.email}`}
            className="font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400"
          >
            {siteConfig.social.email}
          </a>
          {t("applyHintSuffix")}
        </p>
      </div>
    </div>
  );
}
