"use client";

import { type PropsWithChildren } from "react";
import initTranslations from "@/i18n";
import { createInstance, type Resource } from "i18next";
import { I18nextProvider } from "react-i18next";

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources,
}: PropsWithChildren<{
  locale: string;
  namespaces: string[];
  resources: Resource;
}>) {
  const i18n = createInstance();

  void initTranslations(locale, namespaces, i18n, resources);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
