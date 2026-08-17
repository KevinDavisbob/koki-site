import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/site";

export async function Footer() {
  const t = await getTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-2 px-6 py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>
          © {year} {siteConfig.name}. {t("rights")}
        </p>
        <p>
          {t("builtWith")}
          <span className="mx-1 text-indigo-500">·</span>
          <a
            href={`mailto:${siteConfig.social.email}`}
            className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {siteConfig.social.email}
          </a>
        </p>
      </div>
    </footer>
  );
}
