"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/icons/logo.svg";
import { LanguageChangeControl } from "@/features/localisation/components/LanguageChangeControl";
import { useTranslation } from "react-i18next";

import { APP_LINK } from "@/lib/constants";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer>
      <div className="flex w-[41rem] flex-col gap-y-8 pb-10">
        <div className="flex justify-between gap-x-20">
          <Link
            target="_blank"
            href={APP_LINK.IOS}
            className="flex w-[16.5rem] items-center gap-x-3 rounded-3xl bg-fill-primary p-4"
          >
            <div className="flex items-center gap-x-4">
              <div className="flex items-center justify-center">
                <Image
                  src={Logo}
                  className="size-10 shrink-0 text-fill-surface-inverse"
                  alt={"logo"}
                />
              </div>
            </div>
            <p className="grow text-12-medium text-typography-secondary">
              {t("home.footer.downloadApp")}
            </p>
          </Link>
          <div className="flex w-[15.6875rem] justify-between gap-x-20">
            <div className="flex flex-col gap-y-4">
              <Link
                href={"/private"}
                className="text-14-medium text-typography-secondary"
              >
                {t("navigation.tabs.home.title")}
              </Link>
              <Link
                href={"/private/payments"}
                className="text-14-medium text-typography-secondary"
              >
                {t("navigation.tabs.payments.title")}
              </Link>
            </div>
            <div className="flex flex-col gap-y-4  text-right">
              <Link
                href={"/contact"}
                className="text-14-medium text-typography-secondary"
              >
                {t("navigation.tabs.contactWithTheBank.title")}
              </Link>
              <Link
                href={"/private/statement"}
                className="text-14-medium text-typography-secondary"
              >
                {t("navigation.tabs.history.title")}
              </Link>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <p className="max-w-[16.5rem] text-12-regular text-typography-secondary">
            {t("home.footer.universalLicense")}
          </p>
          <div className={"flex items-center gap-2"}>
            <LanguageChangeControl />
          </div>
        </div>
      </div>
    </footer>
  );
}
