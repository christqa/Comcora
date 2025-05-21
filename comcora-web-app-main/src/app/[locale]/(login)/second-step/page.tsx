"use client";

import React, { Suspense } from "react";
import { SecondStepForm } from "@/features/login/components/SecondStepForm";
import { useTranslation } from "react-i18next";

import { BackNavigationControl } from "@/components/ui/BackNavigationControl";
import { LoaderModal } from "@/components/ui/loader-modal";
import { Overlay } from "@/components/ui/overlay";

export default function SecondStepPage() {
  const { t } = useTranslation();

  return (
    <div className={"relative w-full"}>
      <div
        className={"flex flex-col gap-y-10 rounded-5xl bg-fill-background-main"}
      >
        <div className={"fixed left-8 top-[115px]"}>
          <BackNavigationControl />
        </div>
        <div className="flex flex-col gap-y-4">
          <h4 className="text-center text-32-medium text-typography-primary">
            {t("auth.confirmation.enterCode")}
          </h4>
          <p className="text-center text-16-medium text-typography-secondary">
            {t("auth.confirmation.enterSentCode")}
          </p>
        </div>
        <Suspense
          fallback={
            <Overlay visible>
              <LoaderModal visible />
            </Overlay>
          }
        >
          <SecondStepForm />
        </Suspense>
      </div>
    </div>
  );
}
