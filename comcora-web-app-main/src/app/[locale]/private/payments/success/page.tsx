"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { PaymentSuccessDetails } from "@/features/payments/components/PaymentSuccessDetails";
import { PaymentSuccessSideBar } from "@/features/payments/components/PaymentSuccessSideBar";
import User from "@/features/payments/components/User";
import { PromoBanner } from "@/features/promo/components/PromoBanner";
import { api } from "@/features/trpc-client/hooks/react";
import { type PaymentOrderDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import { useTranslation } from "react-i18next";

import { formatDateTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center gap-4">
    <Skeleton className="h-6 w-[300px] rounded-xl bg-fill-primary" />
    <Skeleton className="size-18 rounded-xl bg-fill-primary" />
    <Skeleton className="h-6 w-20 rounded-xl bg-fill-primary" />
    <Skeleton className="h-12 w-[164px] rounded-xl bg-fill-primary" />
  </div>
);

const PaymentSuccessContent = () => {
  const { t } = useTranslation();
  const pathname = useParams();
  const { locale } = pathname;
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  const { data, isFetched } = api.payments.findOrderDetails.useQuery(
    { paymentId: paymentId ?? "" },
    {
      enabled: Boolean(paymentId),
    }
  );

  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const {
    beneficiaryName: name,
    beneficiaryAmount: amount,
    beneficiaryCurrency: currency,
    status,
    beneficiaryAccountNumber: accountNumber,
    beneficiaryFiName,
    originatorAccountNumber,
    date,
  } = data ?? ({} as PaymentOrderDTO);

  if (!isFetched) {
    return <LoadingFallback />;
  }

  return (
    <div className="flex flex-col gap-10">
      {data?.beneficiaryName ? (
        <>
          <div className="flex flex-col items-center justify-center gap-4">
            <h4 className="text-32-medium text-typography-primary">
              {t("payments.success.transferred")}!
            </h4>
            <User
              avatar={""}
              name={name}
              status={status}
              size={"small"}
              colorType={"primary"}
              showLabel={false}
              avatarSize="L"
            />
            <div className="flex flex-col items-center p-2 pb-0">
              <p className="text-32-medium text-typography-primary">
                - {amount} {currency}
              </p>
            </div>
            <div className="flex flex-col text-center">
              <span className="text-14-medium text-typography-primary">
                {name}
              </span>
            </div>
            <Link href={"/private/payments/new-payment"} className="flex-1">
              <div className="w-190 flex items-center rounded-xl bg-primary p-4 px-6">
                <span className="text-14-medium text-typography-primary-inverse">
                  {t("payments.success.repeatOperation")}
                </span>
              </div>
            </Link>
          </div>
          <PaymentSuccessDetails
            accountNumber={accountNumber}
            beneficiaryBank={beneficiaryFiName}
            originatorAccountNumber={originatorAccountNumber}
            setOpen={setOpen}
            date={formatDateTime(date, locale) ?? ""}
          />
          <PromoBanner />
          <PaymentSuccessSideBar
            open={open}
            setOpen={setOpen}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        </>
      ) : null}
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
