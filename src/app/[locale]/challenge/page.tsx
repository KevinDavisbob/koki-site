import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing, toLocale } from "@/i18n/routing";
import { ChallengeGame } from "@/components/challenge-game";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/challenge">): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = toLocale(locale) ?? routing.defaultLocale;
  const t = await getTranslations({ locale: validLocale, namespace: "Challenge" });
  return { title: t("title"), description: t("description") };
}

export default async function ChallengePage({
  params,
}: PageProps<"/[locale]/challenge">) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  if (!locale) notFound();
  await setRequestLocale(locale);

  const t = await getTranslations("Challenge");

  return (
    <div className="pb-12">
      <div className="mx-auto w-full max-w-3xl px-6 pt-8">
        <Link
          href="/security"
          className="text-sm text-zinc-500 transition-colors hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
        >
          ← {t("back")}
        </Link>
      </div>
      <ChallengeGame />
    </div>
  );
}
