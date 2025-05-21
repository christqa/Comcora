"use client";

import { useRouter } from "next/navigation";
import { AccountWidget } from "@/features/account/components/AccountWidget";
import { AccountProvider } from "@/features/account/hooks/AccountProvider";
import ConfirmationProvider from "@/features/confirmation/hooks/ConfirmationContext";
import { LimitIndicator } from "@/features/limits/components/LimitIndicator";
import { LimitsProvider } from "@/features/limits/lib/LimitsContext";
import { LatestTransactionsWidget } from "@/features/transactions/components/LatestTransactionsWidget";
import { RegularWidget } from "@/features/transactions/components/RegularWidget";
import { useTranslation } from "react-i18next";

import { BackNavigationControl } from "@/components/ui/BackNavigationControl";
import { Icon } from "@/components/ui/icon";

type PageProps = {
  params: { slug: string };
};

const AccountsPage = (props: PageProps) => {
  const {
    params: { slug: accountId },
  } = props;
  const { t } = useTranslation();
  const router = useRouter();

  const goBack = () => {
    router.push("/private");
  };

  return (
    <AccountProvider accountId={accountId}>
      <div className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-4">
          <BackNavigationControl onClick={goBack} />
          <ConfirmationProvider>
            <AccountWidget />
          </ConfirmationProvider>
        </div>
        <div className="flex w-[41rem] gap-x-4">
          <RegularWidget
            href={"/private/payments/new-payment"}
            title={t("payments.main.newPayment")}
            icon={<Icon name="24/Primary/Flag" className="size-6" />}
            className={"flex-1"}
          />
          <RegularWidget
            href={"/private/payments/request-money"}
            title={t("home.products.moneyRequest")}
            icon={<Icon name="24/Primary/CashOut" className="size-6" />}
            className={"flex-1"}
          />
          <LimitsProvider type={"account"} entityId={accountId}>
            <LimitIndicator type={"account"} />
          </LimitsProvider>
        </div>
        <LatestTransactionsWidget accountId={accountId} />
      </div>
    </AccountProvider>
  );
};

export default AccountsPage;
