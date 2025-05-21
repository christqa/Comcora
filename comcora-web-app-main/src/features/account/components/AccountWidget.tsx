import Link from "next/link";
import { AccountActionsControl } from "@/features/account/components/AccountActionsControl";
import { AccountDetailsControl } from "@/features/account/components/AccountDetailsControl";
import { AccountNameControl } from "@/features/account/components/AccountNameControl";
import { useAccount } from "@/features/account/hooks/AccountProvider";
import { AccountsProvider } from "@/features/account/hooks/AccountsProvider";
import CardThumbnail from "@/features/cards/components/card-thumbnail";
import {
  useConfirmation,
  type ConfirmationInit,
} from "@/features/confirmation/hooks/ConfirmationContext";
import { type AccountCurrencyCode } from "@/types/local.types";
import { useTranslation } from "react-i18next";

import { cn, convertToCurrencyObject } from "@/lib/utils";

import styles from "./AccountWidget.module.css";

export function AccountWidget() {
  const { t } = useTranslation();
  const { account } = useAccount();
  const { confirm } = useConfirmation();

  const balance = convertToCurrencyObject(
    account?.balance.currentBalance,
    account?.currency as AccountCurrencyCode
  );

  const handleCloseAccount = async () => {
    const confirmationDetails = await new Promise<ConfirmationInit>((r) => {
      setTimeout(
        () =>
          r({
            type: "phone",
          }),
        600
      );
    });

    const { success } = await confirm(confirmationDetails);

    if (!success) {
      return { success: false };
    }
    return {
      success: true,
    };
  };

  const balanceItem = convertToCurrencyObject(
    account?.balance.availableBalance,
    account?.currency as AccountCurrencyCode
  );
  const balanceInEur = convertToCurrencyObject(
    account?.balance.availableBalanceEur
  );

  return (
    <div className="relative flex w-[41rem] flex-col gap-y-4 overflow-hidden rounded-2xl bg-fill-primary p-4">
      <div
        className={cn(
          "-mx-4 -mt-4 flex h-[4rem] items-center justify-between p-4",
          styles.headerGradient
        )}
      >
        <div className="flex gap-x-2">
          <span className="text-20-medium text-typography-surface-inverse">
            {account?.alias}
          </span>
          <AccountNameControl type={"account"} />
        </div>
        <AccountDetailsControl />
      </div>
      <div className="flex flex-col gap-y-8">
        <div className="flex gap-x-6">
          <div className="flex grow flex-col gap-y-1">
            <span className="text-14-medium text-typography-disabled">
              {t("accounts.widget.totalFunds")}
            </span>
            <div className="flex">
              <h4 className="text-40-medium text-typography-primary">
                {balance.base}
              </h4>
              <h4 className="text-40-medium text-typography-secondary">
                ,{balance.decimals} {balance.currencySign}
              </h4>
            </div>
          </div>
          <div className="flex w-[11.5625rem] flex-col gap-y-2">
            <div className="flex items-center gap-x-2" key={account?.currency}>
              <div className="flex grow items-center justify-end gap-x-2">
                <div className="flex">
                  <span className="text-14-medium text-typography-primary">
                    {balanceItem.base}
                  </span>
                  <span className="text-14-medium text-typography-secondary">
                    ,{balanceItem.decimals} {balanceItem.currencySign}
                  </span>
                </div>
              </div>
              <div className="flex grow items-center justify-end gap-x-2">
                <span className="text-14-medium text-typography-disabled">
                  {balanceInEur.base},{balanceInEur.decimals}{" "}
                  {balanceInEur.currencySign}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div className="mt-4 flex flex-wrap gap-2">
            {account?.cards.map((card) => {
              return (
                <Link
                  key={card.id}
                  href={
                    "/private/accounts/" + account?.id + "/cards/" + card.id
                  }
                >
                  <CardThumbnail lastFour={card.number} />
                </Link>
              );
            })}
          </div>
          <AccountsProvider>
            <AccountActionsControl onClose={handleCloseAccount} />
          </AccountsProvider>
        </div>
      </div>
    </div>
  );
}
