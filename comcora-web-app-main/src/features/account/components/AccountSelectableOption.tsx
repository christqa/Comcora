import { useCallback, type PropsWithChildren } from "react";

import { cn, convertToCurrencyObject } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/icon";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Thumbnail } from "@/components/ui/thumbnail";

export const AccountSelectableOption = (
  props: PropsWithChildren<{
    amount: string | number;
    description?: string;
    currencySymbol: "EUR" | "USD";
    icon: IconName;
    checked?: boolean;
    onChangeValue?: (v: boolean) => void;
  }>
) => {
  const {
    amount,
    description,
    currencySymbol,
    icon,
    checked = false,
    onChangeValue,
  } = props;

  const amountData = convertToCurrencyObject(Number(amount), currencySymbol);

  const handleSelectOption = useCallback(() => {
    if (typeof onChangeValue === "function") {
      onChangeValue(true);
    }
  }, []);

  return (
    <div
      className="flex justify-center gap-x-4 rounded-[1.25rem] px-4 py-2"
      onClick={handleSelectOption}
    >
      <Thumbnail variant={"light"}>
        <Icon
          name={icon}
          className="mx-auto size-6 self-center text-icon-primary"
        />
      </Thumbnail>
      <div className={"flex flex-1 flex-col"}>
        <div className={"text-16-semibold"}>
          <span>{amountData.base}</span>
          <span className={"text-typography-secondary"}>
            ,{amountData.decimals} {amountData.currencySign}
          </span>
        </div>
        <SectionTitle>{description}</SectionTitle>
      </div>
      <div className={"flex size-10 items-center justify-center"}>
        <Icon
          name={checked ? "24/Primary/RadioCheck" : "24/Primary/Circle"}
          className={cn("h-6 w-6", {
            "text-icon-secondary": !checked,
            "text-icon-success": checked,
          })}
        />
      </div>
    </div>
  );
};
