"use client";

import { useEffect, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { TransactionsSkeleton } from "@/features/transactions/components/TransactionsSkeleton";
import { useTransactions } from "@/features/transactions/hooks/TransactionsProvider";
import { useTranslation } from "react-i18next";

import { formatDateToText, groupTransactionsByDate } from "@/lib/utils";

import { TransactionHistoryItem } from "./TransactionHistoryItem";

export const TransactionHistoryOptions = () => {
  const {
    paginatedData,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isFetched,
    isFetching,
  } = useTransactions();

  const pathname = useParams();
  const { locale } = pathname;
  const { t } = useTranslation();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMoreData = () => {
    if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
      void fetchNextPage();
    }
  };

  useEffect(() => {
    if (!hasNextPage || typeof fetchNextPage !== "function") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          loadMoreData();
        }
      },
      { threshold: 0.1 }
    );
    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  const groupedTransactions = useMemo(
    () => groupTransactionsByDate(paginatedData),
    [paginatedData]
  );

  const entries = groupedTransactions
    ? Object.entries(groupedTransactions)
    : [];

  return (
    <>
      <div className="flex flex-col gap-y-6">
        {isFetching && !isFetchingNextPage && paginatedData?.length === 0 ? (
          <TransactionsSkeleton />
        ) : (
          <>
            {entries.length ? (
              entries.map(([date, transactions]) => (
                <div key={date} className="flex flex-col">
                  <div className="flex justify-between px-4 pb-4">
                    <span className="grow text-14-medium text-typography-secondary">
                      {formatDateToText(date, locale, t)}
                    </span>
                  </div>
                  <div className="flex flex-col rounded-3xl bg-fill-primary">
                    {transactions.map((transaction) => (
                      <TransactionHistoryItem
                        key={transaction.id}
                        transaction={transaction}
                        context="history"
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : isFetched &&
              groupedTransactions &&
              !Object.keys(groupedTransactions).length ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="text-16-medium text-typography-critical">
                  {t("common.notifications.noResults")}
                </div>
                <span className="text-12-medium text-typography-secondary">
                  {t("common.notifications.tryChangingCriteria")}
                </span>
              </div>
            ) : (
              <TransactionsSkeleton />
            )}
            <div
              className={isFetchingNextPage ? "none" : "block"}
              ref={loadMoreRef}
            />
            {isFetchingNextPage && <TransactionsSkeleton />}
          </>
        )}
      </div>
    </>
  );
};
