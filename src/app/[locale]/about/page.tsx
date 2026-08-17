import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, toLocale } from "@/i18n/routing";
import { getContentPage } from "@/lib/posts";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = toLocale(locale) ?? routing.defaultLocale;
  const t = await getTranslations({ locale: validLocale, namespace: "About" });
  return { title: t("title") };
}

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  if (!locale) notFound();
  await setRequestLocale(locale);
  const t = await getTranslations("About");

  const page = await getContentPage(locale, "about");

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {typeof page?.frontmatter.title === "string"
          ? page.frontmatter.title
          : t("title")}
      </h1>
      {page ? (
        <div className="mt-8">{page.content}</div>
      ) : (
        <p className="mt-8 text-zinc-600 dark:text-zinc-400">
          {t("title")}
        </p>
      )}
    </div>
  );
}
