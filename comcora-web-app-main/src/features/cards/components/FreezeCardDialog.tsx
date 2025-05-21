"use client";

import { useEffect, useState } from "react";
import { useAccount } from "@/features/account/hooks/AccountProvider";
import { RegularWidget } from "@/features/transactions/components/RegularWidget";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";

type PageProps = {
  setIsFrozen: (v: boolean) => void;
  isFrozen: boolean;
  activeCard: string;
};

export function FreezeCardDialog(props: PageProps) {
  const { setIsFrozen, isFrozen, activeCard } = props;
  const { t } = useTranslation();
  const { updateCardState, account, refetch } = useAccount();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (account?.cards.length && activeCard) {
      const activeCardState = account.cards.find(
        (item) => item.id === activeCard
      )?.state;
      setIsFrozen(activeCardState === "TEMPORARILY_BLOCKED");
    }
  }, [account, activeCard]);

  const handleCardFreeze = async () => {
    await updateCardState(isFrozen ? "ACTIVE" : "TEMPORARILY_BLOCKED").then(
      (result) => {
        if (result) {
          void refetch();
        }
      }
    );
    setIsFrozen(!isFrozen);
    setOpen(false);
  };

  return (
    <>
      <RegularWidget
        title={!isFrozen ? t("cards.freeze") : t("cards.unfreeze")}
        className={"w-[152px]"}
        icon={
          <Icon
            name={!isFrozen ? "24/Primary/Snowflake" : "24/Primary/Unfreeze"}
            className="size-6"
          />
        }
        href="#"
        onClick={() => setOpen(true)}
      />
      <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
        <DialogContent className={"w-[400px]"}>
          <DialogHeader>
            <Icon
              className={"size-10 text-icon-critical"}
              name={"40/Caution/Warning"}
            />
            <DialogTitle>
              {t("cards.yourCardWillBe")}
              <br />
              {!isFrozen ? t("cards.frozen.web") : t("cards.unfrozen.web")}
            </DialogTitle>
            <DialogDescription>
              {!isFrozen
                ? t("cards.alwaysAnOptionToDefrost")
                : t("cards.youCanAlwaysUseIt")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={!isFrozen ? "secondary-critical" : "secondary-success"}
              size={"L"}
              className="capitalize"
              onClick={handleCardFreeze}
            >
              {!isFrozen ? t("cards.freeze") : t("cards.unfreeze")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
