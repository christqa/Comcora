"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AccountsProvider } from "@/features/account/hooks/AccountsProvider";
import ConfirmationProvider from "@/features/confirmation/hooks/ConfirmationContext";
import AccountsSelect from "@/features/invoices/components/AccountsSelect";
import Withdrawal from "@/features/payments/components/Withdrawal";
import { api } from "@/features/trpc-client/hooks/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type AccountSummaryDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { BackNavigationControl } from "@/components/ui/BackNavigationControl";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  originatorRequisiteId: z.string().min(1, t("common.form.fieldRequired")),
  beneficiaryRequisiteId: z.string().min(1, t("common.form.fieldRequired")),
  amount: z.number(),
});

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center gap-4">
    <Skeleton className="h-18 w-full rounded-xl bg-fill-primary" />
    <Skeleton className="h-18 w-full rounded-xl bg-fill-primary" />
  </div>
);

const BetweenAccountsContent = () => {
  const [isEnoughBalance, setIsEnoughBalance] = useState(false);
  const [numericValue, setNumericValue] = useState(0);
  const [currency, setCurrency] = useState("€");
  const [selectedAccount, setSelectedAccount] = useState<AccountSummaryDTO>();

  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  const { data } = api.payments.getTransactionById.useQuery(
    { id: paymentId ?? "" },
    {
      enabled: Boolean(paymentId),
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const isEnoughBalanceHandler = () => {
    if (numericValue === 0) {
      setIsEnoughBalance(true);
      return;
    }
    if (!selectedAccount || numericValue <= 0 || numericValue === 0) {
      setIsEnoughBalance(false);
      return;
    }

    const { currentBalance } = selectedAccount.balance;
    const isInsufficient = numericValue > currentBalance;

    setIsEnoughBalance(isInsufficient);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <BackNavigationControl />
        <h4 className="text-32-medium text-typography-primary">
          {t("payments.betweenAccounts.title")}
        </h4>
      </div>
      <Form {...form}>
        <form>
          <div className="flex flex-col gap-10">
            <AccountsProvider>
              <AccountsSelect
                title={t("payments.main.fromWhereToTransfer")}
                name={"originatorRequisiteId"}
                setCurrency={setCurrency}
                setSelectedAccount={setSelectedAccount}
                selectedAccountNumber={data?.originatorAccountNumber}
                isEnoughBalanceHandler={isEnoughBalanceHandler}
                selectedAccount={selectedAccount}
              />
            </AccountsProvider>
            <AccountsProvider>
              <AccountsSelect
                title={t("payments.main.whereToTransfer")}
                name={"beneficiaryRequisiteId"}
                selectedAccountNumber={data?.beneficiaryAccountNumber}
                selectedAccount={selectedAccount}
              />
            </AccountsProvider>
            <ConfirmationProvider>
              <Withdrawal
                currency={currency}
                setNumericValue={setNumericValue}
                numericValue={numericValue}
                isEnoughBalance={isEnoughBalance}
                isEnoughBalanceHandler={isEnoughBalanceHandler}
                context={"betweenAccounts"}
              />
            </ConfirmationProvider>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BetweenAccountsContent />
    </Suspense>
  );
}
