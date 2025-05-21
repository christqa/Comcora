"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PaymentSuccessDetails } from "@/features/payments/components/PaymentSuccessDetails";
import { PaymentSuccessSideBar } from "@/features/payments/components/PaymentSuccessSideBar";
import User from "@/features/payments/components/User";
import { PromoBanner } from "@/features/promo/components/PromoBanner";
import { useTranslation } from "react-i18next";

import { mockUser } from "@/lib/mock-data";

export default function Page() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const { name, amount, currency, status, accountNumber, avatar } = mockUser;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center justify-center gap-4">
        <h4 className="text-32-medium text-typography-primary">
          {t("payments.success.transferred")}!
        </h4>
        <User
          avatar={avatar}
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
          <span className="text-14-medium text-typography-primary">{name}</span>
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
        setOpen={setOpen}
        date={""}
        originatorAccountNumber={""}
        beneficiaryBank={""}
      />
      <PromoBanner />
      <PaymentSuccessSideBar
        open={open}
        setOpen={setOpen}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
    </div>
  );
}
