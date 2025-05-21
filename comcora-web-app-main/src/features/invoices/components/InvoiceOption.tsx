import { type PropsWithChildren, type ReactElement } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { convertToCurrencyObject } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ListOption } from "@/components/ui/list-option";
import { Thumbnail } from "@/components/ui/thumbnail";

type InvoiceOptionProps = {
  id: number;
  date: string;
  amount: number | string;
  name: string;
  thumbnail: ReactElement;
  currencySymbol: "EUR" | "USD";
  debitDate?: string;
};

export default function InvoiceOption(
  props: PropsWithChildren<InvoiceOptionProps>
) {
  const { t } = useTranslation();
  const { amount, thumbnail, name, date, currencySymbol, debitDate, id } =
    props;

  const amountData = convertToCurrencyObject(amount, currencySymbol);

  return (
    <div className="group">
      <ListOption>
        <Thumbnail variant={"light"}>{thumbnail}</Thumbnail>
        <div className="flex grow items-center justify-between">
          <div className="flex grow flex-col">
            <div className="flex gap-x-4">
              <span className="grow text-16-semibold text-typography-primary">
                {name}
              </span>
              <div className="flex group-hover:hidden">
                <span className="text-16-semibold text-typography-primary">
                  {amountData.base}
                  <span className={"text-typography-secondary"}>
                    ,{amountData.decimals} {amountData.currencySign}
                  </span>
                </span>
              </div>
            </div>
            {debitDate ? (
              <div className="flex items-center gap-x-1">
                <span className="text-12-medium text-typography-primary">
                  {date}
                </span>
                <Icon
                  name={"16/Primary/Interpunct"}
                  className="size-4 text-typography-secondary"
                />
                <span className="text-12-medium text-typography-secondary">
                  {`${t("einvoices.invoices.willBeCharged")} ${debitDate}`}
                </span>
              </div>
            ) : (
              <span className="text-12-medium text-typography-primary">
                {`${t("einvoices.invoices.payDue")} ${date}`}
              </span>
            )}
          </div>
          <Link href={`invoices/${id}/`}>
            <Button
              onClick={(e) => e.stopPropagation()}
              variant={"accent"}
              size={"M"}
              className="hidden w-[168px] text-14-medium group-hover:flex"
            >
              {`${t("einvoices.invoices.pay")} ${amountData.base},${amountData.decimals}`}
              {amountData.currencySign}{" "}
            </Button>
          </Link>
        </div>
      </ListOption>
    </div>
  );
}
