"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NewPaymentWidget from "@/features/payments/components/NewPaymentWidget";
import { useTranslation } from "react-i18next";

import { BackNavigationControl } from "@/components/ui/BackNavigationControl";
import { LoaderModal } from "@/components/ui/loader-modal";
import { Overlay } from "@/components/ui/overlay";

const NewPayment = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <BackNavigationControl />
        <h4 className="text-32-medium text-typography-primary">
          {userId
            ? t("common.buttonText.transfer")
            : t("payments.newPayment.title")}
        </h4>
      </div>
      <NewPaymentWidget />
    </div>
  );
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <Overlay visible>
          <LoaderModal visible />
        </Overlay>
      }
    >
      <NewPayment />
    </Suspense>
  );
}
