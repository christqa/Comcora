"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { useAccounts } from "@/features/account/hooks/AccountsProvider";
import { useAuth } from "@/features/login/hooks/AuthContext";
import { type Transaction } from "@/features/transactions/lib/transaction";
import { api } from "@/features/trpc-client/hooks/react";
import isEqual from "lodash.isequal";

interface Filters {
  accountIds?: string[];
  cardIds?: string[];
  startDate?: string;
  endDate?: string;
  type?: string[];
  operationType?: string;
  count?: number;
  keyword?: string;
  limit?: number;
}

type TransactionsProviderProps = Filters & {
  limit?: number;
};

export interface TransactionsContextMethods {
  transactions?: Transaction[];
  paginatedData?: Transaction[];
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => Promise<unknown>;
  isFetching: boolean;
  isFetched: boolean;
}

export const TransactionsContext = createContext<TransactionsContextMethods>({
  transactions: [],
  paginatedData: [],
  fetchNextPage: undefined,
  isFetchingNextPage: false,
  hasNextPage: false,
  isFetching: false,
  isFetched: false,
});

export const useTransactions = () => useContext(TransactionsContext);

export function TransactionsProvider(
  props: PropsWithChildren<TransactionsProviderProps>
) {
  const {
    children,
    accountIds,
    cardIds,
    startDate,
    endDate,
    type,
    operationType,
    count,
    keyword,
  } = props;

  const increment = count ?? 8;
  const { privateAccounts, savingsAccounts, multiCurrencyAccounts } =
    useAccounts();
  const { encryptedAccessPin } = useAuth();
  const [pages, setPages] = useState<Transaction[]>([]);
  const [offset, setOffset] = useState(0);
  const [nextOffset, setNextOffset] = useState<number | null>(0);

  const filtersRef = useRef<Filters>({
    accountIds,
    cardIds,
    startDate,
    endDate,
    type,
    operationType,
    keyword,
  });

  useEffect(() => {
    const newFilters: Filters = {
      accountIds,
      cardIds,
      startDate,
      endDate,
      type,
      operationType,
      keyword,
    };

    if (!isEqual(filtersRef.current, newFilters)) {
      filtersRef.current = newFilters;
      setPages([]);
      setOffset(0);
      setNextOffset(0);
    }
  }, [accountIds, cardIds, startDate, endDate, type, operationType, keyword]);

  const accountAliasMap = useMemo(() => {
    const allAccounts = [
      ...privateAccounts,
      ...savingsAccounts,
      ...multiCurrencyAccounts,
    ];
    return allAccounts.reduce(
      (acc, account) => {
        acc[account.number] = account.alias;
        return acc;
      },
      {} as Record<string, string>
    );
  }, [privateAccounts, savingsAccounts, multiCurrencyAccounts]);

  useEffect(() => {
    if (pages.length === 0 || Object.keys(accountAliasMap).length === 0) return;

    setPages((prevPages) =>
      prevPages.map((transaction) => ({
        ...transaction,
        accountAlias:
          accountAliasMap[transaction.accountId] ?? transaction.accountAlias,
      }))
    );
  }, [accountAliasMap, pages.length]);

  const {
    data: paginatedData,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetched,
  } = api.transaction.getTransactions.useInfiniteQuery(
    {
      ...filtersRef.current,
      offset,
      count: increment,
      limit: increment,
    },
    {
      enabled:
        Boolean(encryptedAccessPin) && Object.keys(accountAliasMap).length > 0,
      getNextPageParam: (lastPage, pages) => {
        const pageCount = increment ?? 0;

        if (lastPage.length < pageCount) {
          return undefined;
        }
        return pages.length * pageCount;
      },
      select: (data) => {
        return data.pages.flatMap((page) =>
          page.map((transaction) => ({
            ...transaction,
            accountAlias:
              accountAliasMap[transaction.accountId] ?? transaction.accountId,
          }))
        ) as Transaction[];
      },
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (Array.isArray(paginatedData) && paginatedData.length === 0) {
      setPages([]);
    }

    if (Array.isArray(paginatedData) && paginatedData.length > 0) {
      const newPages: Transaction[] = paginatedData;

      setPages((prevPages) => {
        const uniqueTransactions = new Set<string>();
        const mergedPages = [...prevPages, ...newPages].filter((item) => {
          if (!item.id || uniqueTransactions.has(item.id)) return false;
          uniqueTransactions.add(item.id);
          return true;
        });

        return isEqual(prevPages, mergedPages) ? prevPages : mergedPages;
      });

      if (newPages.length < increment) {
        setNextOffset(null);
      } else {
        setNextOffset(offset + newPages.length);
      }
    }
  }, [paginatedData, keyword]);

  const fetchNextPageWrapper = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage || nextOffset === null) return;

    await fetchNextPage();
    setOffset(nextOffset);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, nextOffset]);

  return (
    <TransactionsContext.Provider
      value={{
        transactions: pages,
        paginatedData: pages,
        fetchNextPage: fetchNextPageWrapper,
        isFetchingNextPage,
        hasNextPage,
        isFetching,
        isFetched,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
