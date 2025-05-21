import { useEffect, useState } from "react";
import Link from "next/link";
import { LatestTransactionsFeed } from "@/features/transactions/components/LatestTransactionsFeed";
import { useTransactions } from "@/features/transactions/hooks/TransactionsProvider";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

interface LatestTransactionsContentProps {
  accountId?: string;
  cardId?: string;
  onLoadMore: () => void;
}
export function LatestTransactionsContent({
  accountId,
  cardId,
  onLoadMore,
}: LatestTransactionsContentProps) {
  const { t } = useTranslation();
  const { transactions, hasNextPage, isFetched } = useTransactions();

  const [qs, setQs] = useState("");

  useEffect(() => {
    const query: Record<string, string> = {};
    if (accountId) {
      query.accountIds = accountId;
    }
    if (cardId) {
      query.cardIds = cardId;
    }
    setQs(
      Object.keys(query).length > 0
        ? "?" + new URLSearchParams(query).toString()
        : ""
    );
  }, [accountId, cardId]);

  if (isFetched && transactions?.length === 0) {
    return;
  }

  return (
    <div className="flex w-[41rem] flex-col items-center gap-y-4">
      <div className="flex w-full justify-between">
        <span className="grow text-24-medium text-typography-primary">
          {t("transactions.latestOperations")}
        </span>

        <Button size="S" variant="primary" className={"w-[155px]"}>
          <Link href={"/private/statement" + qs}>
            {t("transactions.operationsHistory")}
          </Link>
        </Button>
      </div>
      <div className="flex w-[41rem] flex-col rounded-3xl bg-fill-primary">
        <LatestTransactionsFeed
          accountId={accountId}
          cardId={cardId}
          context="payments"
        />
        {!!hasNextPage && (
          <div className="flex items-end justify-between p-4">
            <Button
              variant={"secondary-success"}
              className={"w-full"}
              onClick={onLoadMore}
            >
              {t("common.buttonText.showMore")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
