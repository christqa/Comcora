"use client";

import { type PropsWithChildren } from "react";
import { type TransactionContext } from "@/features/transactions/components/TransactionHistoryOption";
import { TransactionsSkeleton } from "@/features/transactions/components/TransactionsSkeleton";
import { useTransactions } from "@/features/transactions/hooks/TransactionsProvider";

import { TransactionHistoryItem } from "./TransactionHistoryItem";

type LatestTransactionsFeedProps = {
  param?: string;
  accountId?: string;
  cardId?: string;
  context?: TransactionContext;
};

export function LatestTransactionsFeed(
  props: PropsWithChildren<LatestTransactionsFeedProps>
) {
  const { accountId, cardId, context } = props;
  const { transactions, isFetched } = useTransactions();

  return (
    <div className="flex flex-col rounded-3xl bg-fill-primary">
      {!isFetched ? (
        <div className="pt-6">
          <TransactionsSkeleton />
        </div>
      ) : (
        <div className="flex flex-col rounded-3xl bg-fill-primary">
          {transactions && transactions.length > 0
            ? transactions.map((transaction) => (
                <TransactionHistoryItem
                  key={transaction.id}
                  transaction={transaction}
                  context={context}
                  accountId={accountId}
                  cardId={cardId}
                />
              ))
            : null}
        </div>
      )}
    </div>
  );
}
