"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { addDays, format, subMonths, subWeeks, subYears } from "date-fns";
import { enGB, et, ru } from "date-fns/locale";
import { type TFunction } from "i18next";
import { type DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Icon } from "@/components/ui/icon";
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const getDatePeriods = (t: TFunction) => [
  { name: t("common.dates.week"), value: "week" },
  { name: t("common.dates.month"), value: "month" },
  { name: t("common.dates.halfYear"), value: "halfYear" },
  { name: t("common.dates.year"), value: "year" },
  { name: t("common.dates.selectRange"), value: "range" },
];

type PageProps = {
  handleDateRangeChange: (value: DateRange | undefined) => void;
  dateRange: DateRange | undefined;
  setDateRange: (v: DateRange | undefined) => void;
  activeFilter?: { name: string; value: string };
  setActiveFilter?: (v: { name: string; value: string }) => void;
};

export function DatePickerFilter(props: PageProps) {
  const { t } = useTranslation();
  const datePeriods = useMemo(() => getDatePeriods(t), [t]);
  const {
    handleDateRangeChange,
    dateRange,
    setDateRange,
    activeFilter,
    setActiveFilter,
  } = props;

  const pathname = useParams();
  const { locale } = pathname;

  const [open, setOpen] = useState(false);

  const localeLanguage = locale === "et" ? et : locale === "ru" ? ru : enGB;

  useEffect(() => {
    handleDateRangeChange(dateRange);
  }, [dateRange, handleDateRangeChange]);

  const handleDateOptionClick = (item: { name: string; value: string }) => {
    setActiveFilter && setActiveFilter(item);
    switch (item.value) {
      case "week":
        setDateRange({
          from: addDays(subWeeks(new Date(), 1), 1),
          to: new Date(),
        });
        break;
      case "month":
        setDateRange({
          from: addDays(subMonths(new Date(), 1), 1),
          to: new Date(),
        });
        break;
      case "halfYear":
        setDateRange({
          from: addDays(subMonths(new Date(), 6), 1),
          to: new Date(),
        });
        break;
      case "year":
        setDateRange({
          from: addDays(subYears(new Date(), 1), 1),
          to: new Date(),
        });
        break;
      default:
        return false;
    }
  };

  const handleClearFilter = (event: React.FormEvent) => {
    event.preventDefault();
    setDateRange({
      from: undefined,
      to: undefined,
    });
    setActiveFilter && setActiveFilter({ name: "", value: "" });
  };

  const handleClearActiveFilter = (event: React.FormEvent) => {
    event.stopPropagation();
    setDateRange({
      from: undefined,
      to: undefined,
    });
    setActiveFilter && setActiveFilter({ name: "", value: "" });
  };

  return (
    <Popover open={open} onOpenChange={(v) => setOpen(v)}>
      <PopoverTrigger asChild>
        <div
          className={`flex gap-x-1 rounded-xl ${open ? "bg-fill-primary-active" : "bg-fill-primary"} cursor-pointer py-2 pl-4 pr-2`}
        >
          <span
            className={`text-center text-14-medium ${!open && dateRange?.from ? "text-typography-success" : "text-typography-primary"}`}
          >
            <>
              {dateRange?.from ? (
                dateRange.to ? (
                  dateRange.from.getTime() === dateRange.to.getTime() ? (
                    format(dateRange.from, "LLL dd, y", {
                      locale: localeLanguage,
                    })
                  ) : (
                    <>
                      {format(dateRange.from, "LLL dd, y", {
                        locale: localeLanguage,
                      })}{" "}
                      -{" "}
                      {format(dateRange.to, "LLL dd, y", {
                        locale: localeLanguage,
                      })}
                    </>
                  )
                ) : (
                  format(dateRange.from, "LLL dd, y", {
                    locale: localeLanguage,
                  })
                )
              ) : (
                <span>{t("common.dates.dates")}</span>
              )}
            </>
          </span>
          {!open && dateRange?.from ? (
            <Button
              variant={"transparent"}
              className={"size-fit p-0 text-typography-success"}
              onClick={(e) => handleClearFilter(e)}
            >
              <Icon name="16/Primary/Cross" className="size-4" />
            </Button>
          ) : (
            <Icon name="16/Primary/ArrowDown" className="size-4" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto bg-fill-primary p-4" sideOffset={10}>
        <div className="flex gap-x-4">
          {activeFilter?.value === "range" ? (
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={1}
              locale={localeLanguage}
              showOutsideDays={false}
              disabled={(date) => date > new Date()}
            />
          ) : (
            <Calendar
              mode="single"
              selected={dateRange?.from}
              onSelect={(date) => setDateRange({ from: date, to: date })}
              numberOfMonths={1}
              locale={localeLanguage}
              showOutsideDays={false}
              disabled={(date) => date > new Date()}
            />
          )}
          <div className="flex flex-col gap-2">
            {datePeriods.map((item) => (
              <Button
                variant={"transparent"}
                key={item.value}
                className={`h-8 w-fit gap-x-1 rounded-xl bg-fill-primary-light py-0 ${activeFilter?.value === item.value ? "pl-4 pr-2" : "px-4"} cursor-pointer`}
                onClick={() => handleDateOptionClick(item)}
              >
                <span
                  className={`text-center text-14-medium ${activeFilter?.value === item.value ? "text-typography-success" : "text-typography-primary"}`}
                >
                  {item.name}
                </span>
                {activeFilter?.value === item.value ? (
                  <Icon
                    name="16/Primary/Cross"
                    className="size-4 text-typography-success"
                    onClick={(e) => handleClearActiveFilter(e)}
                  />
                ) : null}
              </Button>
            ))}
          </div>
        </div>
        <PopoverArrow className={"h-2 w-4 fill-fill-primary"} />
      </PopoverContent>
    </Popover>
  );
}
