import localFont from "next/font/local";
import TranslationsProvider from "@/features/translations/hooks/TranslationsProvider";
import { ZodTranslationProvider } from "@/features/translations/hooks/ZodTranslationProvider";
import { TRPCReactProvider } from "@/features/trpc-client/hooks/react";
import initTranslations from "@/i18n";
import { i18n, type Locale } from "@/i18n-config";

import ResponsiveScreenAlert from "@/components/ui/ResponsiveScreenAlert";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const fontSuisseIntlRegular = localFont({
  src: [
    {
      path: "../../assets/fonts/SuisseIntl-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../assets/fonts/SuisseIntl-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../assets/fonts/SuisseIntl-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-suisse",
});

const i18nNamespaces = ["guest", "private"];

export const metadata = {
  title: "Comcora bank",
  description: "A universal bank solution",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${fontSuisseIntlRegular.className} ${fontSuisseIntlRegular.variable} bg-fill-background-main`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <TranslationsProvider
            namespaces={i18nNamespaces}
            locale={locale}
            resources={resources}
          >
            <TRPCReactProvider>
              <ZodTranslationProvider locale={locale} />
              <div className={"hidden lg:block"}>{children}</div>
              <ResponsiveScreenAlert />
              <Toaster />
            </TRPCReactProvider>
          </TranslationsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
