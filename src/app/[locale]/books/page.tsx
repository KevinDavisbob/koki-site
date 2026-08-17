import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, toLocale } from "@/i18n/routing";
import { getBooks, type Book, type BookStatus } from "@/lib/books";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/books">): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = toLocale(locale) ?? routing.defaultLocale;
  const t = await getTranslations({ locale: validLocale, namespace: "Books" });
  return { title: t("title"), description: t("description") };
}

function BookItem({ book, ratingSuffix }: { book: Book; ratingSuffix: string }) {
  return (
    <li className="flex flex-col gap-1.5 rounded-xl border border-zinc-200 p-5 transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:hover:border-indigo-700">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="font-semibold">{book.title}</h3>
        {book.rating !== undefined && (
          <span className="text-sm text-amber-500" aria-label={`${book.rating}${ratingSuffix}`}>
            {"★".repeat(book.rating)}
            <span className="text-zinc-300 dark:text-zinc-600">
              {"★".repeat(5 - book.rating)}
            </span>
          </span>
        )}
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{book.author}</p>
      {book.note && (
        <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {book.note}
        </p>
      )}
    </li>
  );
}

export default async function BooksPage({
  params,
}: PageProps<"/[locale]/books">) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  if (!locale) notFound();
  await setRequestLocale(locale);

  const t = await getTranslations("Books");
  const books = getBooks(locale);

  const sections: { status: BookStatus; label: string }[] = [
    { status: "reading", label: t("reading") },
    { status: "finished", label: t("finished") },
    { status: "want", label: t("want") },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">{t("description")}</p>

      {books.length === 0 ? (
        <p className="mt-16 text-center text-zinc-500 dark:text-zinc-400">
          {t("empty")}
        </p>
      ) : (
        <div className="mt-10 flex flex-col gap-10">
          {sections.map(({ status, label }) => {
            const items = books.filter((b) => b.status === status);
            if (items.length === 0) return null;
            return (
              <section key={status}>
                <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  {label} · {items.length}
                </h2>
                <ul className="flex flex-col gap-3">
                  {items.map((book) => (
                    <BookItem key={book.title} book={book} ratingSuffix={t("rating")} />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
