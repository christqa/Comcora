"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { NavControl } from "@/features/profile/components/NavControl";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/theme-switcher";

export const Header = () => {
  const { t } = useTranslation();
  const segment = useSelectedLayoutSegment();

  return (
    <header className={"sticky top-0 z-10 "}>
      <div className={"pt-6"}>
        <div className="gap-x-7.5 flex h-18 items-center justify-between rounded-3xl bg-fill-black-a02 p-4 backdrop-blur-xl">
          <div className="flex">
            <Button
              asChild={true}
              size="M"
              variant={segment === "(main)" ? "primary-inverse" : "transparent"}
              className="flex items-center justify-center gap-x-2 rounded-xl px-6 py-3"
            >
              <Link href={"/private"}>{t("navigation.tabs.home.title")}</Link>
            </Button>
            <Button
              asChild={true}
              size="M"
              variant={
                segment === "payments" ? "primary-inverse" : "transparent"
              }
              className="flex items-center justify-center gap-x-2 rounded-xl px-6 py-3"
            >
              <Link href={"/private/payments"}>
                {t("navigation.tabs.payments.title")}
              </Link>
            </Button>
            <Button
              asChild={true}
              size="M"
              variant={
                segment === "statement" ? "primary-inverse" : "transparent"
              }
              className="flex items-center justify-center gap-x-2 rounded-xl px-6 py-3"
            >
              <Link href={"/private/statement"}>
                {t("navigation.tabs.history.title")}
              </Link>
            </Button>
            <Button
              asChild={true}
              size="M"
              variant={
                segment === "contact" ? "primary-inverse" : "transparent"
              }
              className="flex items-center justify-center gap-x-2 rounded-xl px-6 py-3"
            >
              <Link href={"/contact"}>
                {t("navigation.tabs.contactWithTheBank.title")}
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-x-2">
            <ModeToggle mode="icon" />
            <NavControl />
          </div>
        </div>
      </div>
    </header>
  );
};
