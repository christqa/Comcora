"use client";

import React, { type PropsWithChildren } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAccounts } from "@/features/account/hooks/AccountsProvider";
import CardThumbnail from "@/features/cards/components/card-thumbnail";
import { type AccountCurrencyCode } from "@/types/local.types";
import { type CardSummaryDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models";

import { convertToCurrencyObject } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import { SensitiveInfo } from "@/components/ui/SensitiveInfo";
import { Thumbnail } from "@/components/ui/thumbnail";

export const AccountOption = (
  props: PropsWithChildren<{
    amount: string | number;
    description?: string;
    currencySymbol: AccountCurrencyCode;
    icon: IconName;
    cards?: CardSummaryDTO[];
    id: string;
  }>
) => {
  const { amount, description, currencySymbol, icon, cards = [], id } = props;
  const { isAccountHidden, setAccountHidden } = useAccounts();
  const accountHidden = isAccountHidden(id);

  const amountData = convertToCurrencyObject(amount, currencySymbol);

  const pathname = useParams();
  const router = useRouter();

  const { slug } = pathname;
  const isActiveItem = slug === id;

  const goToCardPage = (event: React.MouseEvent, cardId: string) => {
    event.preventDefault();
    router.push(`/private/accounts/${id}/cards/${cardId}`);
  };

  const handleAccountVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAccountHidden(id, !accountHidden);
  };

  return (
    <div className="group px-2">
      <div
        className={`flex gap-4 rounded-[1.25rem] p-2 ${isActiveItem ? "justify-between bg-fill-background-main" : "justify-center"}`}
      >
        <Thumbnail variant={isActiveItem ? "primary" : "light"}>
          <Icon
            name={icon}
            className="mx-auto size-6 self-center text-icon-primary"
          />
        </Thumbnail>
        <div className="flex grow flex-col">
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col">
              <SensitiveInfo hidden={accountHidden}>
                <p className="text-16-semibold">
                  {amountData.base}
                  <span className={"text-typography-secondary"}>
                    ,{amountData.decimals} {amountData.currencySign}
                  </span>
                </p>
              </SensitiveInfo>
              <span
                className={
                  "text-12-medium text-typography-secondary group-hover:text-typography-primary"
                }
              >
                {description}
              </span>
            </div>
            <div className={"invisible group-hover:visible"}>
              <Button
                variant={"transparent"}
                className={"p-0"}
                onClick={handleAccountVisibility}
              >
                <Thumbnail variant="primary">
                  <Icon
                    name={
                      accountHidden ? "24/Primary/Eye" : "24/Primary/EyeClosed"
                    }
                    className={`size-6 ${accountHidden ? "text-icon-primary" : "text-icon-secondary"}`}
                  />
                </Thumbnail>
              </Button>
            </div>
          </div>
          {cards.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {cards.map((card) => (
                <CardThumbnail
                  key={card.number}
                  lastFour={card.number}
                  onClick={(e) => goToCardPage(e, card.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
