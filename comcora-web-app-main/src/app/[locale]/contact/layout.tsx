import React from "react";
import TranslationsProvider from "@/features/translations/hooks/TranslationsProvider";
import initTranslations from "@/i18n";
import { type Locale } from "@/i18n-config";

const i18nNamespaces = ["private"];

export default async function ContactsLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      {children}
    </TranslationsProvider>
  );
}
