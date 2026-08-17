"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
      <p className="text-7xl font-bold tracking-tight text-indigo-500">404</p>
      <h1 className="mt-6 text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">{t("description")}</p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
