export const i18n = {
  defaultLocale: "et",
  locales: ["et", "en", "ru"],
  prefixDefault: false,
} as const;

export type Locale = (typeof i18n)["locales"][number];
