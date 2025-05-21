"use client";

import { Suspense } from "react";
import { AccountsProvider } from "@/features/account/hooks/AccountsProvider";
import TransactionsWidget from "@/features/transactions/components/TransactionsWidget";
import { type Locale } from "@/i18n-config";
import { useTranslation } from "react-i18next";

type PageProps = {
  params: { locale: Locale };
};

const Page = (props: PageProps) => {
  const { t } = useTranslation();
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: { locale },
  } = props;

  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex flex-col gap-y-10">
        <h4 className="text-32-medium text-typography-primary">
          {t("transactions.operationsHistory")}
        </h4>
        <AccountsProvider>
          <Suspense>
            <TransactionsWidget />
          </Suspense>
        </AccountsProvider>
      </div>
    </div>
  );
};

export default Page;
