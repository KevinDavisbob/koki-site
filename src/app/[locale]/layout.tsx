import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BootScreen } from "@/components/boot-screen";
import { BackToTop } from "@/components/back-to-top";
import { routing, toLocale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// themeColor 在 Next 16 已从 metadata 弃用，必须用独立的 viewport export
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: {
      default: t("title"),
      template: `%s · ${siteConfig.name}`,
    },
    description: t("description"),
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: locale === "zh" ? "zh_CN" : "en_US",
      url: siteConfig.url,
      // og:title/description 由 title 模板与 description 自动继承；
      // og:image 由 opengraph-image.tsx 文件约定自动注入（绝对 URL）
    },
    twitter: {
      card: "summary_large_image",
      // twitter:image 不会从 opengraph-image 文件自动推导，需显式声明
      images: [
        `${locale === routing.defaultLocale ? "" : `/${locale}`}/opengraph-image`,
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  const validLocale = toLocale(locale);
  if (!validLocale) notFound();
  await setRequestLocale(validLocale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <BackToTop />
          </NextIntlClientProvider>
        </ThemeProvider>
        <BootScreen />
        {/* 无 JS 环境下隐藏启动界面，避免永久遮住页面 */}
        <noscript>
          <style>{".boot-screen{display:none}"}</style>
        </noscript>
      </body>
    </html>
  );
}
