import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

export async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const year = new Date().getFullYear();

  const links = [
    { href: "/projects" as const, label: nav("projects") },
    { href: "/roadmap" as const, label: nav("roadmap") },
    { href: "/resources" as const, label: nav("resources") },
    { href: "/books" as const, label: nav("books") },
    { href: "/archive" as const, label: nav("archive") },
  ];

  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 px-6 py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>
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
