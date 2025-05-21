import React from "react";
import TranslationsProvider from "@/features/translations/hooks/TranslationsProvider";
import initTranslations from "@/i18n";
import { type Locale } from "@/i18n-config";

import ResponsiveScreenAlert from "@/components/ui/ResponsiveScreenAlert";

const i18nNamespaces = ["private"];

export default async function ResponsiveScreenLayout({
  locale,
}: {
  locale: Locale;
}) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <ResponsiveScreenAlert />
    </TranslationsProvider>
  );
}
