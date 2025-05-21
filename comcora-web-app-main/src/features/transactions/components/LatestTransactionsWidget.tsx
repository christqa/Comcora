"use client";

import { useState, type PropsWithChildren } from "react";
import { AccountsProvider } from "@/features/account/hooks/AccountsProvider";
import { TransactionsProvider } from "@/features/transactions/hooks/TransactionsProvider";

import { LatestTransactionsContent } from "./LatestTransactionsContent";

type LatestTransactionsWidgetProps = {
  accountId?: string;
  cardId?: string;
};

const DEFAULT_COUNT = 4;

export function LatestTransactionsWidget(
  props: PropsWithChildren<LatestTransactionsWidgetProps>
) {
  const { accountId, cardId } = props;

  const [count, setCount] = useState(DEFAULT_COUNT);

  return (
    <AccountsProvider>
      <TransactionsProvider
        count={count}
        accountIds={accountId ? [accountId] : []}
        cardIds={cardId ? [cardId] : []}
      >
        <LatestTransactionsContent
          accountId={accountId}
          cardId={cardId}
          onLoadMore={() => setCount((prev) => prev + DEFAULT_COUNT)}
        />
      </TransactionsProvider>
    </AccountsProvider>
  );
}
