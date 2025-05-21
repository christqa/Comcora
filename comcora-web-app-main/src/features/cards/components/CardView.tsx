import { useState, type PropsWithChildren } from "react";
import { AccountNameControl } from "@/features/account/components/AccountNameControl";
import { useAccount } from "@/features/account/hooks/AccountProvider";
import { formatCreditCardNumber } from "@/features/cards/lib/util";
import { type CardSummaryDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import { useTranslation } from "react-i18next";

import { cn, convertToCurrencyObject } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

import styles from "./CardView.module.css";

type CardProps = {
  data: CardSummaryDTO;
  readonly?: boolean;
  isFrozen?: boolean;
};

export function CardView(props: PropsWithChildren<CardProps>) {
  const { data, readonly = false, isFrozen = false } = props;
  const { account } = useAccount();
  const { toast } = useToast();
  const { t } = useTranslation();
  const balance = convertToCurrencyObject(account?.balance.currentBalance);
  const [reversed, setReversed] = useState(false);
  const [expiryYear, expiryMonth, expiryDate] = data.expiration.split("-");

  const handleCopyCardNumber = async () => {
    if (!data.number) {
      return;
    }
    try {
      await navigator.clipboard.writeText(formatCreditCardNumber(data.number));
      toast({
        title: t("accounts.messages.dataCopied"),
      });
    } catch (error) {
      console.error("Failed to copy the card number:", error);
    }
  };

  return (
    <div className={styles.host}>
      <div
        className={cn(styles.inner, "h-52 w-80", reversed && styles.reversed)}
      >
        <div
          className={cn(
            "flex flex-shrink-0 flex-col justify-between gap-y-10 rounded-2xl bg-brand-mastercard p-4 " +
              styles.front,
            isFrozen && styles.frozen
          )}
        >
          {isFrozen ? (
            <div className="absolute left-0 top-0 z-10 flex size-full flex-col justify-center gap-4 p-4">
              <Icon
                name={"24/Primary/Snowflake"}
                className={"text-typography-surface"}
              />
              <p className={"text-center text-typography-surface"}>
                {data.alias} · · · ·{" "}
                {formatCreditCardNumber(data.number).split(" ").pop() ?? "0000"}
              </p>
            </div>
          ) : null}
          <div className="flex flex-col justify-center gap-y-2">
            <div className="flex flex-col justify-center gap-y-1">
              <div className="flex items-center gap-x-2">
                <span className="grow text-12-medium text-typography-surface">
                  {data.alias}
                </span>
                {!readonly ? (
                  <AccountNameControl type={"card"} cardData={data} />
                ) : null}
              </div>
              <span className="text-10-medium text-typography-surface">
                · · · ·{" "}
                {formatCreditCardNumber(data.number).split(" ").pop() ?? "0000"}
              </span>
            </div>
            <div className="flex">
              <h4 className="text-32-medium text-typography-surface">
                {" "}
                {balance.base}
              </h4>
              <h4 className="text-32-medium text-typography-secondary">
                ,{balance.decimals} {balance.currencySign}
              </h4>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex">
              {!readonly ? (
                <Button
                  size="S"
                  variant="primary"
                  className={"w-[122px] gap-x-2"}
                  onClick={() => setReversed(true)}
                >
                  <Icon name="24/Primary/Eye" className="size-4" />
                  {t("cards.details")}
                </Button>
              ) : null}
            </div>
            <Icon name={"40/Logo/MasterCard"} className="h-8 w-12" />
          </div>
        </div>

        <div
          className={
            "flex flex-col justify-between gap-y-10 rounded-2xl bg-fill-primary p-4 " +
            styles.back
          }
        >
          <div className="flex flex-col gap-y-2">
            <div className="flex gap-x-2">
              <p className="text-16-medium text-typography-primary">
                {formatCreditCardNumber(data.number)}
              </p>
              <Icon
                name={"24/Primary/Copy"}
                className="size-6 cursor-pointer"
                onClick={() => handleCopyCardNumber()}
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="text-12-medium text-typography-secondary">
              <p>
                {t("cards.until")}{" "}
                <span className={"text-typography-primary"}>
                  {expiryMonth}/{expiryYear}
                </span>
              </p>
              <p>
                {t("cards.canBeUsedUntil")} {expiryDate}{" "}
                {t("dates.month.longQuantified." + Number(expiryMonth))}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex">
                {!readonly ? (
                  <Button
                    size="S"
                    variant="secondary-success"
                    onClick={() => setReversed(false)}
                  >
                    <Icon name="24/Primary/EyeClosed" className="size-4" />
                    {t("cards.hideDetails")}
                  </Button>
                ) : null}
              </div>
              <Icon name={"40/Logo/MasterCard"} className="h-10 w-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
