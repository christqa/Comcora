"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type TransformedAccount } from "@/types/business-service.types";
import { type DateRange } from "react-day-picker";

type ActivePeriod = {
  name: string;
  value: string;
};
export function useFilters({
  transactionTypeFilters,
  items,
}: {
  transactionTypeFilters: { label: string; value: string }[];
  items: TransformedAccount[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : undefined,
    to: searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : undefined,
  });

  const [checkedAccountsCardsItems, setCheckedAccountsCardsItems] = useState<
    Record<string, boolean | "indeterminate">
  >({});
  const [checkedTypes, setCheckedTypes] = useState<
    Record<string, boolean | "indeterminate">
  >({});
  const [checkedStartDate, setCheckedStartDate] = useState<string>(
    searchParams.get("startDate") ?? ""
  );
  const [checkedEndDate, setCheckedEndDate] = useState<string>(
    searchParams.get("endDate") ?? ""
  );
  const [checkedDirection, setCheckedDirection] = useState<string>(
    searchParams.get("direction") ?? ""
  );
  const [searchKeyword, setSearchKeyword] = useState<string>(
    searchParams.get("searchKeyword") ?? ""
  );

  const [activeFilter, setActiveFilter] = useState<ActivePeriod>({
    name: "",
    value: "",
  });

  const checkedAccountIds = useMemo(() => {
    return items
      .filter((item) => checkedAccountsCardsItems[item.value])
      .map((item) => item.value);
  }, [checkedAccountsCardsItems, items]);

  const checkedCardIds = useMemo(() => {
    const cardIds: string[] = [];
    items.forEach((item) => {
      if (item.subItems) {
        item.subItems.forEach((subItem) => {
          if (checkedAccountsCardsItems[subItem.value]) {
            cardIds.push(subItem.value);
          }
        });
      }
    });
    return cardIds;
  }, [checkedAccountsCardsItems, items]);

  const checkedTypeValues = useMemo(() => {
    return transactionTypeFilters
      .filter((type) => checkedTypes[type.value])
      .map((type) => type.value);
  }, [checkedTypes, transactionTypeFilters]);

  const isSyncingWithURL = useRef(false);

  useEffect(() => {
    isSyncingWithURL.current = true;
    const accountIds = searchParams.get("accountIds")?.split(",") ?? [];
    const cardIds = searchParams.get("cardIds")?.split(",") ?? [];

    setCheckedAccountsCardsItems((prev) => {
      const newCheckedItems = { ...prev };
      accountIds.forEach((id) => {
        newCheckedItems[id] = true;
      });
      cardIds.forEach((id) => {
        newCheckedItems[id] = true;
      });
      return newCheckedItems;
    });

    setCheckedTypes((prev) => {
      const newCheckedTypes = { ...prev };

      return newCheckedTypes;
    });

    setCheckedStartDate(searchParams.get("startDate") ?? "");
    setCheckedEndDate(searchParams.get("endDate") ?? "");
    setCheckedDirection(searchParams.get("direction") ?? "");

    const urlDateRange: DateRange = {
      from: searchParams.get("startDate")
        ? new Date(searchParams.get("startDate")!)
        : undefined,
      to: searchParams.get("endDate")
        ? new Date(searchParams.get("endDate")!)
        : undefined,
    };
    setDateRange(urlDateRange);
    isSyncingWithURL.current = false;
  }, [searchParams]);

  useEffect(() => {
    if (isSyncingWithURL.current) return;

    const params = new URLSearchParams();

    if (checkedStartDate) params.set("startDate", checkedStartDate);
    if (checkedEndDate) params.set("endDate", checkedEndDate);
    if (checkedDirection) params.set("direction", checkedDirection);
    if (checkedAccountIds.length > 0) {
      params.set("accountIds", checkedAccountIds.join(","));
    }
    if (checkedCardIds.length > 0) {
      params.set("cardIds", checkedCardIds.join(","));
    }
    if (checkedTypeValues.length > 0) {
      params.set("type", checkedTypeValues.join(","));
    }

    router.replace(`?${params.toString()}`);
  }, [
    checkedStartDate,
    checkedEndDate,
    checkedDirection,
    searchKeyword,
    router,
    checkedAccountIds,
    checkedCardIds,
    checkedTypeValues,
  ]);

  const handleClearAllFilters = useCallback(() => {
    isSyncingWithURL.current = true;
    setCheckedAccountsCardsItems({});
    setCheckedTypes({});
    setCheckedStartDate("");
    setCheckedEndDate("");
    setCheckedDirection("");
    setSearchKeyword("");
    setActiveFilter({ name: "", value: "" });
    setDateRange(undefined);
    router.replace("");
  }, [router]);

  return {
    dateRange,
    setDateRange,
    checkedAccountsCardsItems,
    setCheckedAccountsCardsItems,
    checkedTypes,
    setCheckedTypes,
    checkedStartDate,
    setCheckedStartDate,
    checkedEndDate,
    setCheckedEndDate,
    checkedDirection,
    setCheckedDirection,
    searchKeyword,
    activeFilter,
    setSearchKeyword,
    setActiveFilter,
    checkedAccountIds,
    checkedCardIds,
    checkedTypeValues,
    handleClearAllFilters,
  };
}
