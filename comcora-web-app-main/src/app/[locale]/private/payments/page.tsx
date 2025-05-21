"use client";

import Link from "next/link";
import { AccountsProvider } from "@/features/account/hooks/AccountsProvider";
import { ContactsProvider } from "@/features/contacts/hooks/ContactsProvider";
import Favourites from "@/features/payments/components/Favourites";
import { LatestTransactionsFeed } from "@/features/transactions/components/LatestTransactionsFeed";
import { RegularWidget } from "@/features/transactions/components/RegularWidget";
import { TransactionsProvider } from "@/features/transactions/hooks/TransactionsProvider";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ListOption } from "@/components/ui/list-option";
import { Thumbnail } from "@/components/ui/thumbnail";

const Page = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-10">
      <ContactsProvider>
        <Favourites />
      </ContactsProvider>
      <div className="flex flex-col gap-y-4">
        <div className="flex w-full justify-between">
          <span className="grow text-24-medium text-typography-primary">
            {t("payments.main.current")}
          </span>
          <Link href={"#"}>
            <Button size="S" variant="primary" className={"w-[155px]"}>
              <Link href={"/private/statement"}>
                {t("payments.main.operationHistory")}
              </Link>
            </Button>
          </Link>
        </div>
        <div className="flex flex-col rounded-3xl bg-fill-primary">
          <AccountsProvider>
            <TransactionsProvider
              count={4}
              type={["CARD_PAYMENTS", "TRANSFERS", "BETWEEN_ACCOUNTS"]}
            >
              <LatestTransactionsFeed context="payments" />
            </TransactionsProvider>
          </AccountsProvider>
        </div>
        <Link href={"/private/payments/new-payment"}>
          <ListOption containerClassName="rounded-3xl p-4" className={"px-0"}>
            <Thumbnail variant={"accent"}>
              <Icon
                name={"16/Primary/Plus"}
                className="size-4 text-typography-surface-inverse"
              />
            </Thumbnail>
            <div className="flex h-10 grow items-center">
              <p className="text-16-semibold text-typography-primary">
                {t("payments.main.addRecipient")}
              </p>
            </div>
          </ListOption>
        </Link>
      </div>
      <div className="flex flex-col gap-y-4">
        <p className="text-24-medium text-typography-primary">
          {t("payments.main.paymentsAndTransfers")}
        </p>
        <section className="flex gap-x-4">
          <RegularWidget
            href={"/private/payments/new-payment"}
            title={t("payments.main.newPayment")}
            icon={<Icon name="24/Primary/Flag" className="size-6" />}
            className={"flex-1 basis-1/4"}
          />
          <RegularWidget
            href={"/private/payments/between-accounts"}
            title={t("payments.main.betweenAccounts")}
            icon={
              <Icon name="24/Primary/RoundAltArrowHalf" className="size-6" />
            }
            className={"flex-1 basis-1/4"}
          />
          <RegularWidget
            href={"/private/payments/request-money"}
            title={t("payments.main.moneyRequest")}
            icon={<Icon name="24/Primary/CashOut" className="size-6" />}
            className={"flex-1 basis-1/4"}
          />
        </section>
      </div>
    </div>
  );
};

export default Page;
