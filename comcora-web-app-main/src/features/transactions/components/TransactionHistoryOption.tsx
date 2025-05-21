"use client";

import { type PropsWithChildren, type ReactElement } from "react";
import { useParams, useRouter } from "next/navigation";
import TransactionAvatar from "@/features/transactions/components/TransactionAvatar";
import {
  type Transaction,
  type TransactionDirection,
} from "@/features/transactions/lib/transaction";
import {
  formatDate,
  resolveLabel,
  TransactionStatus,
} from "@/features/transactions/lib/transaction-utils";
import { type AccountCurrencyCode } from "@/types/local.types";
import { cx } from "class-variance-authority";
import { useTranslation } from "react-i18next";

import { cn, convertToCurrencyObject } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { ListOption } from "@/components/ui/list-option";

export type TransactionContext = "history" | "account" | "card" | "payments";

type TransactionProps = {
  context?: TransactionContext;
  contextReference?: string;
  direction?: TransactionDirection;
  cardId?: string;
} & Pick<
  Transaction,
  | "amount"
  | "currency"
  | "date"
  | "type"
  | "counterPartyImageUri"
  | "counterPartyName"
  | "counterPartyType"
  | "icon"
  | "isWithinOwnAccounts"
  | "isOutgoingOperation"
  | "status"
  | "internalData"
  | "beneficiary"
  | "originator"
>;

export function TransactionHistoryOption(
  props: PropsWithChildren<TransactionProps> & {
    accountId?: string;
    accountAlias: string;
    thumbnail?: ReactElement;
  }
) {
  const {
    amount,
    counterPartyName,
    counterPartyType,
    currency,
    icon,
    type,
    date,
    context,
    cardId,
    accountId: id,
    isWithinOwnAccounts,
    status,
    accountAlias,
    isOutgoingOperation,
    beneficiary,
  } = props;

  const { t } = useTranslation();

  const pathname = useParams();
  const { locale } = pathname;

  const amountData = convertToCurrencyObject(
    amount,
    currency as AccountCurrencyCode,
    1
  );
  const router = useRouter();

  const handleNavigateTo = (event: React.MouseEvent) => {
    if (id) {
      event.stopPropagation();
      router.push(`/private/statement?accountIds=${id}&cardIds=${cardId}`);
    }
  };

  const name =
    type === "TransferBetweenOwnAccounts"
      ? `${isOutgoingOperation ? "From" : "To"} ${accountAlias}`
      : counterPartyName;

  return (
    <ListOption onClick={handleNavigateTo} className={"items-center p-2"}>
      <TransactionAvatar
        type={type}
        counterPartyName={counterPartyName}
        counterPartyType={counterPartyType}
        counterPartyImageUri={icon}
        isWithinOwnAccounts={isWithinOwnAccounts}
        isCustomer={!beneficiary.external}
      />
      <div className="flex grow flex-col gap-y-2">
        <div className="flex flex-col">
          <div className="flex gap-x-4">
            <span className="grow text-left text-16-semibold text-typography-primary">
              {name || t("transactions.notSpecified")}
            </span>
            <div className="flex">
              <span
                className={cx(
                  "text-16-semibold",
                  status === TransactionStatus.Failed
                    ? "text-typography-critical"
                    : "text-typography-primary"
                )}
              >
                <span
                  className={cn(
                    !isOutgoingOperation
                      ? "text-typography-success"
                      : "text-typography-primary"
                  )}
                >
                  {!isOutgoingOperation ? "+" : "-"}
                  {amountData.base}
                </span>
                <span
                  className={cn(
                    "text-typography-secondary",
                    !isOutgoingOperation
                      ? "text-typography-success"
                      : "text-typography-primary"
                  )}
                >
                  ,{amountData.decimals} {amountData.currencySign}
                </span>
              </span>
            </div>
          </div>
          <div className="text-left text-12-medium text-typography-secondary">
            {context === "history" ? (
              <>
                {status === TransactionStatus.Failed ? (
                  <div className={"flex gap-1 "}>
                    <Icon name={"16/Primary/Warning"} color={"critical"} />
                    <span className={"text-12-medium text-typography-critical"}>
                      {t("transactions.status.failed")}
                    </span>
                  </div>
                ) : status === TransactionStatus.Pending ? (
                  <div className={"flex gap-1 "}>
                    <Icon name={"16/Primary/Time"} color={"secondary"} />
                    <span
                      className={"text-12-medium text-typography-secondary"}
                    >
                      {t("transactions.status.pending")}
                    </span>
                  </div>
                ) : (
                  resolveLabel(type, t)
                )}
              </>
            ) : (
              <div className="flex items-center gap-x-1">
                <p className="text-12-medium text-typography-primary">
                  {formatDate(date, locale, t)}
                </p>
                <Icon
                  name={"16/Primary/Interpunct"}
                  className="text-typography-secondary"
                />
                <div className="text-12-medium text-typography-secondary">
                  {isOutgoingOperation
                    ? `${t("transactions.outgoingPayment")}`
                    : `${t("transactions.incomingPayment")}`}{" "}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ListOption>
  );
}
