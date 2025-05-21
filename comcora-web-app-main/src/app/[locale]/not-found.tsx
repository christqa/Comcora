"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

import GuestLayout from "./_layout/GuestLayout";

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <GuestLayout>
      <div className="flex w-full flex-col items-center justify-center gap-10 text-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-32-medium text-typography-primary">
            404
          </h1>
          <h2 className="text-center text-32-medium text-typography-primary">
            {t("notFound.title")}
          </h2>
          <p className="text-center text-16-medium text-typography-secondary">
            {t("notFound.description")}
          </p>
        </div>
        <a href="/">
          <Button variant="accent" size="L">
            {t("notFound.homeButton")}
          </Button>
        </a>
      </div>
    </GuestLayout>
  );
}
