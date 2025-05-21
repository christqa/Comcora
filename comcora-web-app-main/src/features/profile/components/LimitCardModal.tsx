"use client";

import { type FC } from "react";
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

import { type LimitCard } from "./TariffLimitsTab";

type PageProps = {
  open: boolean;
  onClose: () => void;
  limitCard: LimitCard;
  rotate?: boolean;
};

export const LimitCardDialog: FC<PageProps> = ({
  limitCard,
  onClose,
  open,
  rotate,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={"w-[400px]"}>
        <DialogHeader>
          <div className={`${rotate ? "rotate-[-15deg]" : ""}`}>
            {limitCard.image}
          </div>
          <DialogTitle>{limitCard.title}</DialogTitle>
          <DialogDescription>{limitCard.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={"accent"} size={"L"} className="capitalize">
            {t("profile.personalDetails.changePlan")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
