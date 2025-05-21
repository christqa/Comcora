"use client";

import React, { useState, type PropsWithChildren } from "react";
import { useAccount } from "@/features/account/hooks/AccountProvider";
import { CardSlider } from "@/features/cards/components/CardSlider";
import { CardView } from "@/features/cards/components/CardView";

import { Skeleton } from "@/components/ui/skeleton";

type CardSwitcherProps = {
  defaultCardId?: string;
  isFrozen?: boolean;
  setActiveCard?: (id: string) => void;
};

export function CardSwitcher(props: PropsWithChildren<CardSwitcherProps>) {
  const { defaultCardId, isFrozen, setActiveCard } = props;
  const { account } = useAccount();
  const [activeCardId, setActiveCardId] = useState(defaultCardId);

  const handleActiveItemChange = (index: number) => {
    const currentCard = account?.cards[index];
    if (currentCard?.id) {
      setActiveCardId(currentCard.id);
      setActiveCard && setActiveCard(currentCard.id);
    }
  };

  return (
    <CardSlider
      defaultCardId={activeCardId}
      handleActiveItemChange={handleActiveItemChange}
    >
      {!account ? (
        <Skeleton
          className={"flex h-52 w-80 shrink-0 rounded-2xl bg-brand-mastercard"}
        />
      ) : (
        account.cards.map((card) => (
          <CardView
            key={card.id}
            data={card}
            isFrozen={isFrozen && card.id === activeCardId}
          />
        ))
      )}
    </CardSlider>
  );
}
