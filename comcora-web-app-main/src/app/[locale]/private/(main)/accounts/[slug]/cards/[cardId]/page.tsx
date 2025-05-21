"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AccountProvider } from "@/features/account/hooks/AccountProvider";
import { CardAction } from "@/features/cards/components/CardAction";
import { CardSwitcher } from "@/features/cards/components/CardSwitcher";
import { FreezeCardDialog } from "@/features/cards/components/FreezeCardDialog";
import ConfirmationProvider from "@/features/confirmation/hooks/ConfirmationContext";
import { LimitIndicator } from "@/features/limits/components/LimitIndicator";
import { LimitsProvider } from "@/features/limits/lib/LimitsContext";
import { LatestTransactionsWidget } from "@/features/transactions/components/LatestTransactionsWidget";

import { BackNavigationControl } from "@/components/ui/BackNavigationControl";

type PageProps = {
  params: { slug: string; cardId: string };
};

const CardPage = (props: PageProps) => {
  const router = useRouter();
  const {
    params: { slug: accountId, cardId },
  } = props;

  const [isFrozen, setIsFrozen] = useState(false);
  const [activeCard, setActiveCard] = useState(cardId);

  const goBack = () => {
    router.push("/private");
  };

  return (
    <AccountProvider accountId={accountId} cardId={activeCard}>
      <div className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-4">
          <BackNavigationControl onClick={goBack} />
          <div>
            <CardSwitcher
              defaultCardId={cardId}
              isFrozen={isFrozen}
              setActiveCard={setActiveCard}
            />
          </div>
        </div>
        <div className="mt-6 flex w-[41rem] gap-x-4">
          <FreezeCardDialog
            setIsFrozen={setIsFrozen}
            isFrozen={isFrozen}
            activeCard={activeCard}
          />
          <ConfirmationProvider>
            <CardAction defaultCardId={cardId} />
          </ConfirmationProvider>
          <LimitsProvider type={"card"} entityId={accountId}>
            <LimitIndicator type={"card"} />
          </LimitsProvider>
        </div>
        <LatestTransactionsWidget accountId={accountId} cardId={cardId} />
      </div>
    </AccountProvider>
  );
};

export default CardPage;
