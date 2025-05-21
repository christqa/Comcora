"use client";

import { useEffect } from "react";
import initTranslations from "@/i18n";
import { z } from "zod";

const i18nNamespaces = ["private"];

export function ZodTranslationProvider({ locale }: { locale: string }) {
  useEffect(() => {
    const init = async () => {
      const { t } = await initTranslations(locale, i18nNamespaces);

      z.setErrorMap((issue, ctx) => {
        const minimum: number = "minimum" in issue ? Number(issue.minimum) : 1;
        const customMessages: Record<string, string> = {
          too_small: t("common.form.fieldMinLength", { count: minimum }),
        };

        return { message: customMessages[issue.code] ?? ctx.defaultError };
      });
    };

    void init();
  }, [locale]);

  return null;
}
