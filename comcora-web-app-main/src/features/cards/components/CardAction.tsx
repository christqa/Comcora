"use client";

import React, { useState } from "react";
import { useAccount } from "@/features/account/hooks/AccountProvider";
import { CardActionStep } from "@/features/cards/components/CardActionStep";
import { CardView } from "@/features/cards/components/CardView";
import {
  useConfirmation,
  type ConfirmationInit,
} from "@/features/confirmation/hooks/ConfirmationContext";
import { RegularWidget } from "@/features/transactions/components/RegularWidget";
import { type TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

const generateReissueOptions = (t: TFunction) => {
  return [
    { label: t("cards.reissue.options.lost"), value: "lost" },
    { label: t("cards.reissue.options.stolen"), value: "stolen" },
    { label: t("cards.reissue.options.noUse"), value: "noUse" },
    { label: t("cards.reissue.options.other"), value: "other" },
  ];
};

const cardsOptions = [
  { label: "MasterCard Black", value: "mastercard" },
  { label: "Visa Classic", value: "visa" },
  { label: "UnionPay Green", value: "unionpay" },
];

export function CardAction({ defaultCardId }: { defaultCardId: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedReissueOption, setSelectedReissueOption] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const [actionType, setActionType] = useState("");

  const { confirm } = useConfirmation();
  const { account } = useAccount();
  const currentCard = account?.cards.find((item) => item.id === defaultCardId);
  const { toast } = useToast();

  const handleOpenDialog = async () => {
    // TODO: confirmation is not implemented on the backend side, we will just simulate the process
    const confirmationDetails = await new Promise<ConfirmationInit>((r) => {
      setTimeout(
        () =>
          r({
            type: "phone",
          }),
        600
      );
    });

    const { success } = await confirm(confirmationDetails);

    if (!success) {
      return { success: false };
    }
    return {
      success: true,
    };
  };

  const handleReissueSelection = (value: string) => {
    setSelectedReissueOption(value);
  };

  const handleCardSelection = (value: string) => {
    setSelectedCard(value);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <SheetTitle>{t("cards.cardAction")}</SheetTitle>
            <div className="p-4">
              {!currentCard ? (
                <Skeleton
                  className={
                    "flex h-52 w-80 shrink-0 rounded-2xl bg-brand-mastercard"
                  }
                />
              ) : (
                <CardView data={currentCard} readonly={true} />
              )}
            </div>
          </>
        );
      case 2:
        return (
          <CardActionStep
            onChange={handleReissueSelection}
            data={generateReissueOptions(t)}
            actionType={actionType}
            sheetTitle={
              actionType === "close"
                ? t("cards.reissue.closeCardMatter")
                : t("cards.reissue.reissueMatter")
            }
            isAlertShown={!!selectedReissueOption}
          />
        );
      case 3:
        return (
          actionType === "reissue" && (
            <CardActionStep
              onChange={handleCardSelection}
              data={cardsOptions}
              actionType={actionType}
              type={"cards"}
              sheetTitle={t("cards.reissue.reissueMatter")}
              isAlertShown={!!selectedCard}
            />
          )
        );
      default:
        return null;
    }
  };

  const handleNextStep = async (step: number, type: string) => {
    setStep(step);
    setActionType(type);

    if (step === 4 && actionType === "reissue") {
      setOpen(false);
      setStep(1);
      setSelectedReissueOption("");
      setSelectedCard("");
      toast({
        title: t("cards.messages.reissueCard"),
      });
      setStep(1);
    }

    if (step === 3 && actionType === "close") {
      setOpen(false);
      setStep(1);
      setSelectedReissueOption("");
      setSelectedCard("");

      await handleOpenDialog().then((success) => {
        if (success) {
          toast({
            title: `${t("cards.title")} · · · · ${currentCard?.number.split(" ").pop() ?? "0000"} ${t("cards.messages.closed")}`,
          });
        }
      });
    }
  };

  return (
    <>
      <RegularWidget
        title={t("cards.action")}
        className={"w-[152px]"}
        icon={<Icon name="24/Primary/ArrowTailUp" className="size-6" />}
        href="#"
        onClick={() => setOpen(true)}
      />
      <Sheet
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          setStep(1);
        }}
      >
        <SheetContent>
          <SheetHeader className={"h-fit"}>{renderStepContent()}</SheetHeader>
          <SheetFooter className={"absolute bottom-6 left-0 w-full"}>
            <div className="flex flex-col gap-4 px-6">
              {step === 1 ? (
                <>
                  <Button
                    className={"h-14 w-full text-16-medium"}
                    variant={"secondary-success"}
                    onClick={() => handleNextStep(2, "reissue")}
                  >
                    {t("cards.reissue.title")}
                  </Button>
                  <Button
                    className={"h-14 w-full text-16-medium"}
                    variant={"secondary-critical"}
                    onClick={() => handleNextStep(2, "close")}
                  >
                    {t("cards.reissue.closeCard")}
                  </Button>
                </>
              ) : (
                <Button
                  className={"h-14 w-full"}
                  variant={"accent"}
                  disabled={!selectedReissueOption && !selectedCard}
                  onClick={() => handleNextStep(step + 1, actionType)}
                >
                  {t("common.buttonText.continue")}
                </Button>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
