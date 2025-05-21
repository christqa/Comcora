"use client";

import { Suspense, useMemo, useState } from "react";
import { DatePickerFilter } from "@/features/filters/DateFilter";
import { OptionFilter } from "@/features/filters/OptionFilter";
import SingleChoice from "@/features/filters/SingleChoice";
import { format } from "date-fns";
import { type TFunction } from "i18next";
import type { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";

import { LoaderModal } from "@/components/ui/loader-modal";
import { Overlay } from "@/components/ui/overlay";
import { SearchField } from "@/components/ui/SearchField";

const getStatusFilters = (t: TFunction<string, undefined>) => [
  {
    label: t("einvoices.invoices.pendingPayment"),
    value: "pending",
  },
  {
    label: t("einvoices.invoices.paid"),
    value: "paid",
  },
];

type FiltersType = {
  name: string;
  value: string;
};

export default function SearchFilter({ filters }: { filters: FiltersType[] }) {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const statusFilters = useMemo(() => getStatusFilters(t), [t]);

  const [checkedStartDate, setCheckedStartDate] = useState<string | undefined>(
    ""
  );
  const [checkedEndDate, setCheckedEndDate] = useState<string | undefined>("");

  const [checkedOperationType, setCheckedOperationType] = useState("");

  const handleDateRangeChange = (range: DateRange | undefined) => {
    const formattedFrom = range?.from
      ? format(range.from, "yyyy-MM-dd")
      : undefined;
    const formattedTo = range?.to ? format(range.to, "yyyy-MM-dd") : undefined;
    setCheckedStartDate(formattedFrom);
    setCheckedEndDate(formattedTo);
  };

  const handleOperationTypeChange = (type: string) => {
    setCheckedOperationType(type);
  };

  const handleOperationTypeClear = () => {
    setCheckedOperationType("");
  };

  return (
    <div className="flex flex-col gap-y-4">
      <SearchField
        placeholder={t("common.placeholder.search")}
        hint={t("einvoices.invoices.sellerOrAgreementTitle")}
      />
      <div className="flex flex-wrap gap-2">
        <OptionFilter
          filters={filters}
          handleOperationTypeChange={handleOperationTypeChange}
          handleOperationTypeClear={handleOperationTypeClear}
          activeFilter={checkedOperationType}
        />
        <DatePickerFilter
          handleDateRangeChange={handleDateRangeChange}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <Suspense
          fallback={
            <Overlay visible>
              <LoaderModal visible />
            </Overlay>
          }
        >
          <SingleChoice items={statusFilters} name={t("einvoices.status")} />
        </Suspense>
      </div>
    </div>
  );
}
