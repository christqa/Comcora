import React, { type PropsWithChildren } from "react";
import { type AccountCurrencyCode } from "@/types/local.types";

import { convertToCurrencyObject } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/icon";
import { Thumbnail } from "@/components/ui/thumbnail";

export default function AccountSelectItem(
  props: PropsWithChildren<{
    amount: string | number;
    description?: string;
    currencySymbol: AccountCurrencyCode;
    icon: IconName;
    isSelected: boolean;
  }>
) {
  const { amount, description, currencySymbol, icon, isSelected } = props;
  const amountData = convertToCurrencyObject(amount, currencySymbol);

  return (
    <div
      className={`flex flex-1 justify-between rounded-[1.25rem] p-2 hover:bg-fill-background-main ${isSelected ? "bg-fill-background-main" : "bg-fill-primary"}`}
    >
      <div className="flex gap-4">
        <Thumbnail variant={isSelected ? "primary" : "light"}>
          <Icon
            name={icon}
            className="mx-auto size-6 self-center text-icon-primary"
          />
        </Thumbnail>
        <div className="flex flex-col">
          <p className="text-left text-16-semibold">
            {amountData.base}
            <span className={"text-typography-secondary"}>
              ,{amountData.decimals} {amountData.currencySign}
            </span>
          </p>
          <span
            className={"text-left text-12-medium text-typography-secondary"}
          >
            {description}
          </span>
        </div>
      </div>
    </div>
  );
}
