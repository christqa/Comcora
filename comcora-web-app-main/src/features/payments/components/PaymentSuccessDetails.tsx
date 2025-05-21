"use client";

import React from "react";
import { useTranslation } from "react-i18next";

import { maskAccountNumber } from "@/lib/utils";

interface PaymentSuccessDetailsProps {
  accountNumber: string;
  beneficiaryBank: string;
  setOpen: (open: boolean) => void;
  date: string;
  originatorAccountNumber: string;
}

export function PaymentSuccessDetails({
  accountNumber,
  setOpen,
  date,
  originatorAccountNumber,
  beneficiaryBank,
}: PaymentSuccessDetailsProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl bg-fill-primary p-4">
      <div className="mb-4 flex justify-between">
        <p className="text-typography-secondary">
          {t("payments.success.beneficiaryAccount")}
        </p>
        <span className="text-16-small text-typography-primary">
          {accountNumber}
        </span>
      </div>

      <div className="mb-4 flex justify-between">
        <p className="text-typography-secondary">
          {t("payments.success.debitingAccount")}
        </p>
        <span className="text-16-small text-typography-primary">
          {t("payments.success.writeOffFromAccount")}{" "}
          {maskAccountNumber(originatorAccountNumber)}
        </span>
      </div>
      <div className="mb-4 flex justify-between">
        <p className="text-typography-secondary">
          {t("payments.success.beneficiaryBank")}
        </p>
        <p className="text-typography-primary">{beneficiaryBank}</p>
      </div>
      <div className="mb-4 flex justify-between">
        <p className="text-typography-secondary">
          {t("payments.success.transactionDate")}
        </p>
        <p className="text-typography-primary">{date}</p>
      </div>
      <div className="mt-6 flex w-full justify-center rounded-xl bg-fill-secondary py-2">
        <button
          className="text-link text-blue-500"
          onClick={() => setOpen(true)}
        >
          {t("payments.success.saveStatement")}
        </button>
      </div>
    </div>
  );
}
