"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/icons/logo.svg";
import { LanguageChangeControl } from "@/features/localisation/components/LanguageChangeControl";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ModeToggle } from "@/components/ui/theme-switcher";

export default function GuestLayout({
  children,
  actions,
  className,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative flex min-h-screen min-w-[1140px] flex-col">
      <div className="fixed left-0 top-0 flex w-full items-center justify-between px-8 py-4">
        <Image src={Logo} className="size-16 shrink-0" alt={"logo"} />
        {actions}
        <div className="flex items-center gap-x-2 ">
          <Link href={"/contact"}>
            {/* @TODO: refactor into Tag component */}
            <Button
              variant={"primary"}
              size={"S"}
              className="w-[140px] rounded-xl px-4 text-14-medium shadow-s"
            >
              {t("general.contactWithTheBank")}
            </Button>
          </Link>
          <ModeToggle mode="button" />
          <LanguageChangeControl />
        </div>
      </div>
      <div
        className={`container flex grow  justify-center pb-6 pt-24 ${className}`}
      >
        <div className="relative flex">{children}</div>
      </div>
      <SectionTitle className="w-full pb-4 text-center">
        © AO &quot;Comcora&quot; {currentYear}
      </SectionTitle>
    </div>
  );
}
