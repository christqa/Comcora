"use client";

import React, { Suspense, useMemo } from "react";
import { useAccounts } from "@/features/account/hooks/AccountsProvider";
import { DatePickerFilter } from "@/features/filters/DateFilter";
import { MultiChoiceFilter } from "@/features/filters/MultiChoiceFilter";
import { OptionFilter } from "@/features/filters/OptionFilter";
import { TransactionHistoryOptions } from "@/features/transactions/components/TransactionHistoryOptions";
import { TransactionsProvider } from "@/features/transactions/hooks/TransactionsProvider";
import { format } from "date-fns";
import { type TFunction } from "i18next";
import type { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";

import {
  convertAccountCardsData,
  multipleChoiceDataConversion,
} from "@/lib/utils";
import { useFilters } from "@/hooks/use-filters";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { LoaderModal } from "@/components/ui/loader-modal";
import { Overlay } from "@/components/ui/overlay";
import { SearchField } from "@/components/ui/SearchField";

const getDepositWithdrawalFilters = (t: TFunction) => [
  { value: "CREDIT", name: t("common.buttonText.debit") },
  { value: "DEBIT", name: t("common.buttonText.credit") },
];

const getTransactionTypeFilters = (t: TFunction) => [
  {
    label: t("transactions.transactionTypes.payments"),
    value: "CARD_PAYMENTS",
  },
  {
    label: t("transactions.transactionTypes.transfers"),
    value: "TRANSFERS",
  },
  {
    label: t("transactions.transactionTypes.betweenAccounts"),
    value: "BETWEEN_ACCOUNTS",
  },
];

const TransactionsWidget = () => {
  const { savingsAccounts, multiCurrencyAccounts, privateAccounts } =
    useAccounts();
  const { t } = useTranslation();

  const depositWithdrawalFilters = getDepositWithdrawalFilters(t);
  const transactionTypeFilters = getTransactionTypeFilters(t);

  const allAccounts = useMemo(() => {
    return [...savingsAccounts, ...multiCurrencyAccounts, ...privateAccounts];
  }, [savingsAccounts, multiCurrencyAccounts, privateAccounts]);

  const items = convertAccountCardsData(allAccounts);

  const {
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
    setSearchKeyword,
    checkedAccountIds,
    checkedCardIds,
    checkedTypeValues,
    handleClearAllFilters,
    activeFilter,
    setActiveFilter,
  } = useFilters({ transactionTypeFilters, items });

  const handleAccountsCardsChange = (
    value: string,
    checked: boolean | "indeterminate"
  ) => {
    multipleChoiceDataConversion(
      value,
      checked,
      setCheckedAccountsCardsItems,
      checkedAccountsCardsItems,
      items
    );
  };

  const handleTypesChange = (
    value: string,
    checked: boolean | "indeterminate"
  ) => {
    multipleChoiceDataConversion(
      value,
      checked,
      setCheckedTypes,
      checkedTypes,
      transactionTypeFilters
    );
  };

  const handleClearFilter = (event: React.FormEvent, type: string) => {
    event.preventDefault();
    if (type === "types") {
      setCheckedTypes({});
    } else {
      setCheckedAccountsCardsItems({});
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    const formattedFrom = range?.from ? format(range.from, "yyyy-MM-dd") : "";
    const formattedTo = range?.to ? format(range.to, "yyyy-MM-dd") : "";
    setCheckedStartDate(formattedFrom);
    setCheckedEndDate(formattedTo);
  };

  const handleOperationTypeChange = (type: string) => {
    setCheckedDirection(type);
  };

  const handleOperationTypeClear = (event: React.FormEvent) => {
    event.preventDefault();
    setCheckedDirection("");
  };
  const hasActiveCheckbox = Object.values(checkedAccountsCardsItems).some(
    (checked) => checked === true
  );

  const hasActiveTypes = Object.values(checkedTypes).some(
    (checked) => checked === true
  );

  const isAnyFilterActive = useMemo(() => {
    const isRangeActive = activeFilter.value === "range";
    const isDateRangeValid =
      (isRangeActive &&
        dateRange?.from !== undefined &&
        dateRange?.to !== undefined) ||
      (!isRangeActive &&
        (dateRange?.from !== undefined || dateRange?.to !== undefined));

    return (
      hasActiveCheckbox ||
      hasActiveTypes ||
      isDateRangeValid ||
      checkedDirection !== ""
    );
  }, [
    checkedAccountsCardsItems,
    checkedTypes,
    dateRange,
    checkedDirection,
    activeFilter.value,
  ]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  const filters = [
    {
      component: (
        <OptionFilter
          filters={depositWithdrawalFilters}
          handleOperationTypeChange={handleOperationTypeChange}
          handleOperationTypeClear={handleOperationTypeClear}
          activeFilter={checkedDirection}
        />
      ),
      isActive: Boolean(checkedDirection),
    },
    {
      component: (
        <Suspense
          fallback={
            <Overlay visible>
              <LoaderModal visible />
            </Overlay>
          }
        >
          <MultiChoiceFilter
            type="type"
            items={transactionTypeFilters}
            name={t("transactions.transactionTypes.transactionType")}
            checkedItems={checkedTypes}
            setCheckedItems={setCheckedTypes}
            handleCheckboxChange={handleTypesChange}
            handleClearFilter={(e) => handleClearFilter(e, "types")}
          />
        </Suspense>
      ),
      isActive: hasActiveTypes,
    },
    {
      component: (
        <DatePickerFilter
          handleDateRangeChange={handleDateRangeChange}
          dateRange={dateRange}
          setDateRange={setDateRange}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      ),
      isActive: Boolean(
        (activeFilter.value === "range" &&
          dateRange?.from !== undefined &&
          dateRange?.to !== undefined) ||
          (activeFilter.value !== "range" &&
            (dateRange?.from !== undefined || dateRange?.to !== undefined))
      ),
    },
    {
      component: (
        <Suspense
          fallback={
            <Overlay visible>
              <LoaderModal visible />
            </Overlay>
          }
        >
          <MultiChoiceFilter
            type="cardsAccounts"
            items={items}
            name={t("transactions.cardsAccounts")}
            checkedItems={checkedAccountsCardsItems}
            setCheckedItems={setCheckedAccountsCardsItems}
            handleCheckboxChange={handleAccountsCardsChange}
            handleClearFilter={(e) => handleClearFilter(e, "accounts")}
          />
        </Suspense>
      ),
      isActive: hasActiveCheckbox,
    },
  ];

  const sortedFilters = filters.sort(
    (a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0)
  );

  return (
    <TransactionsProvider
      cardIds={checkedCardIds}
      accountIds={checkedAccountIds}
      type={checkedTypeValues}
      startDate={checkedStartDate}
      endDate={checkedEndDate}
      operationType={checkedDirection}
      keyword={searchKeyword}
      count={20}
    >
      <div className="flex flex-col gap-y-4">
        <SearchField
          placeholder={t("common.placeholder.search")}
          hint={t("common.hint.search")}
          onSearch={handleSearch}
        />
        <div className="flex flex-wrap gap-2">
          {sortedFilters.map((filter, index) => (
            <React.Fragment key={index}>{filter.component}</React.Fragment>
          ))}
          {isAnyFilterActive && (
            <Button
              size={"S"}
              variant={"primary-inverse"}
              className={
                "rounded-xl py-2 pl-4 pr-2 text-typography-primary-inverse"
              }
              onClick={handleClearAllFilters}
            >
              {t("common.buttonText.clearFilters")}
              <Icon name="16/Primary/Cross" className="size-4" />
            </Button>
          )}
        </div>
      </div>
      <TransactionHistoryOptions />
    </TransactionsProvider>
  );
};

export default TransactionsWidget;
