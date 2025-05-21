import React, { useEffect, useState } from "react";
import { TurnOffLimits } from "@/features/limits/components/TurnOffLimits";
import { type TimePeriod } from "@/features/limits/lib/types";
import { type TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import AutoGrowInput from "@/components/ui/autoGrowInput";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useLimits } from "../lib/LimitsContext";

const generatePeriods = (t: TFunction) => [
  { name: t("shared.limits.periods.day.web"), value: "day" },
  { name: t("shared.limits.periods.month.web"), value: "month" },
];

type PageProps = {
  setOpen: (v: boolean) => void;
  open: boolean;
  accountLimit: number;
  type: "account" | "card";
};

export function ChangeAccountLimit(props: PageProps) {
  const { t } = useTranslation();
  const { open, setOpen, accountLimit } = props;
  const {
    dailyLimit,
    monthlyLimit,
    updateDailyLimit,
    updateMonthlyLimit,
    selectedTimePeriod,
    setSelectedTimePeriod,
    limitsEnabled,
    monthlyLimitEnabled,
    dailyLimitEnabled,
    setLimitsEnabled,
  } = useLimits();

  const [currentDailyLimit, setCurrentDailyLimit] = useState(dailyLimit);
  const [currentMonthlyLimit, setCurrentMonthlyLimit] = useState(monthlyLimit);
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);
  const [openTurnOffDialog, setOpenTurnOffDialog] = useState(false);
  const periods = generatePeriods(t);

  useEffect(() => {
    setCurrentDailyLimit(dailyLimit);
    setCurrentMonthlyLimit(monthlyLimit);
    if (dailyLimit > 0 || monthlyLimit > 0) {
      void setLimitsEnabled(true);
    } else {
      void setLimitsEnabled(false);
    }
  }, [dailyLimit, monthlyLimit]);

  const handleSave = () => {
    const isMonth = selectedTimePeriod === "month";
    const isDay = selectedTimePeriod === "day";
    const isMonthlyLimitEnabled =
      monthlyLimitEnabled || (!monthlyLimitEnabled && !dailyLimitEnabled);
    const isDailyLimitEnabled =
      dailyLimitEnabled || (!monthlyLimitEnabled && !dailyLimitEnabled);

    if ((isMonthlyLimitEnabled && isMonth) || (isDailyLimitEnabled && isDay)) {
      if (isMonth) {
        void updateMonthlyLimit(currentMonthlyLimit);
      } else if (isDay) {
        void updateDailyLimit(currentDailyLimit);
      }
      toast({
        title: t("shared.limits.messages.limitChanged"),
      });
    } else {
      toast({
        title: t("shared.limits.messages.limitCantBeChanged"),
      });
    }
    setOpen(false);
  };

  const handleInputChange = (value: string) => {
    if (selectedTimePeriod === "month") {
      setCurrentMonthlyLimit(Number(value));
      setIsLimitExceeded(Number(value) > accountLimit);
    } else {
      setCurrentDailyLimit(Number(value));
      setIsLimitExceeded(Number(value) > accountLimit);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => setOpen(v)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("shared.limits.setLimit")}</SheetTitle>
            <div className="flex gap-x-4">
              {periods.map((item) => {
                return (
                  <Button
                    variant={
                      selectedTimePeriod === item.value
                        ? "primary-inverse"
                        : "primary"
                    }
                    key={item.value}
                    className={`h-8`}
                    onClick={() => {
                      setSelectedTimePeriod(item.value as TimePeriod);
                    }}
                  >
                    {item.name}
                  </Button>
                );
              })}
            </div>
            <div>
              <div className="flex flex-wrap items-center text-32-medium text-typography-primary">
                <AutoGrowInput
                  autoFocus={true}
                  type={"number"}
                  monthlyLimit={monthlyLimit}
                  dailyLimit={dailyLimit}
                  monthlyLimitEnabled={monthlyLimitEnabled}
                  handleChange={handleInputChange}
                  value={
                    selectedTimePeriod === "month"
                      ? currentMonthlyLimit
                      : currentDailyLimit
                  }
                  className={cn(
                    "h-auto w-auto min-w-[100px] cursor-text rounded-none border-0 bg-transparent p-0 text-32-medium caret-fill-primary-success focus:bg-transparent",
                    isLimitExceeded
                      ? "text-typography-critical"
                      : "text-typography-primary"
                  )}
                />
                <span className={"ml-1 text-typography-secondary"}>€</span>
              </div>
              {isLimitExceeded ? (
                <p className={"mt-1 text-12-medium text-typography-critical"}>
                  {t("shared.limits.cardLimitCantBeGreater")}
                </p>
              ) : (
                <p className={"mt-1 text-12-medium text-typography-secondary"}>
                  {t("shared.limits.onEvery")}{" "}
                  {selectedTimePeriod === "day"
                    ? t("dates.day")
                    : t("dates.month.title")}
                </p>
              )}
            </div>
          </SheetHeader>
          <SheetFooter>
            <div className="flex flex-col gap-4">
              <Button
                className={"h-14 w-full"}
                variant={"accent"}
                disabled={isLimitExceeded}
                onClick={handleSave}
              >
                {t("common.buttonText.save")}
              </Button>
              {limitsEnabled ? (
                <Button
                  className={"h-14 w-full"}
                  variant={"secondary-critical"}
                  onClick={() => {
                    setOpen(false);
                    setOpenTurnOffDialog(true);
                  }}
                >
                  {t("shared.limits.disableLimit")}
                </Button>
              ) : null}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <TurnOffLimits open={openTurnOffDialog} setOpen={setOpenTurnOffDialog} />
    </>
  );
}
