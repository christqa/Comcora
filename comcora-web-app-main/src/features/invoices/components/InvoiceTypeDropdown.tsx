"use client";

import React, { useMemo, useState } from "react";
import { type TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { ListOptionContent } from "@/components/ui/list-option-content";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioOption } from "@/components/ui/radio-option";

const getFilters = (t: TFunction<string, undefined>) => [
  { label: t("einvoices.invoices.byPaymentDate"), value: "byPaymentDate" },
  { label: t("einvoices.invoices.byInvoiceDate"), value: "byInvoiceDate" },
  {
    label: t("einvoices.invoices.byDescendingAmount"),
    value: "byDescendingAmount",
  },
  {
    label: t("einvoices.invoices.byAscendingAmount"),
    value: "byAscendingAmount",
  },
];

export default function InvoiceTypeDropdown() {
  const { t } = useTranslation();
  const filters = useMemo(() => getFilters(t), [t]);
  const [selectedOption, setSelectedOption] = useState(filters[0]);
  const [open, setOpen] = useState(false);

  const onChange = (value: string) => {
    const selected = filters.find((item) => item.value === value);
    setSelectedOption(selected);
  };

  return (
    <DropdownMenu open={open} onOpenChange={(v: boolean) => setOpen(v)}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"transparent"}
          size={"S"}
          className={cn(
            "rounded-xl pl-4 pr-2 text-14-medium text-typography-success",
            open && "bg-fill-secondary-active"
          )}
        >
          {selectedOption?.label}
          <Icon name="16/Primary/ArrowDown" className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[264px] rounded-[1.25rem] border-0 p-0"
      >
        <RadioGroup onValueChange={onChange} value={selectedOption?.value}>
          {filters.map((item) => (
            <DropdownMenuItem
              className={cn(
                "h-12 focus:rounded-none focus:bg-fill-primary-light",
                selectedOption?.value === item.value &&
                  "rounded-none bg-fill-primary-light"
              )}
              key={item.value}
            >
              <RadioOption
                listItemVariant={"default"}
                id={item.value}
                value={item.value}
                className={
                  "flex-row-reverse gap-x-1 bg-transparent px-0 py-1 text-14-medium text-typography-primary"
                }
                radioIconType={"rounded"}
              >
                <ListOptionContent title={item.label} />
              </RadioOption>
            </DropdownMenuItem>
          ))}
        </RadioGroup>
        <DropdownMenuArrow
          className={"h-2 w-4 fill-typography-primary-inverse"}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
