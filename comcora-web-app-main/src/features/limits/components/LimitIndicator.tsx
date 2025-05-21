"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { ChangeAccountLimit } from "@/features/limits/components/ChangeAccountLimit";
import { useTranslation } from "react-i18next";

import { resolveCurrencySign } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { currency } from "../helpers/constants";
import {
  calculatePercentage,
  formatCurrencyParts,
  generateLimitLeftOverLabel,
  generateNotDefinedLimitLabel,
} from "../helpers/helperFunctions";
import { useLimits } from "../lib/LimitsContext";
import { type CreditCard, type LimitType } from "../lib/types";

interface LimitInviteProps {
  card?: CreditCard;
  type?: LimitType;
}

export function LimitIndicator(props: PropsWithChildren<LimitInviteProps>) {
  const { t } = useTranslation();
  const { type = "card" } = props;

  const {
    limitsEnabled,
    dailyLimitUsed,
    dailyLimit,
    monthlyLimitUsed,
    monthlyLimit,
    monthlyLimitEnabled,
    setSelectedTimePeriod,
    selectedTimePeriod,
  } = useLimits();

  useEffect(() => {
    setSelectedTimePeriod(monthlyLimitEnabled ? "month" : "day");
  }, [monthlyLimitEnabled]);

  const [open, setOpen] = useState(false);
  const timePeriod = selectedTimePeriod;

  const { current, limit } = useMemo(() => {
    const limits = { current: 0, limit: 0, timePeriod };
    if (!limitsEnabled) return limits;

    if (monthlyLimitEnabled) {
      limits.current = monthlyLimitUsed;
      limits.limit = monthlyLimit;
      limits.timePeriod = "month";
    } else {
      limits.current = dailyLimitUsed;
      limits.limit = dailyLimit;
      limits.timePeriod = "day";
    }

    return limits;
  }, [
    limitsEnabled,
    monthlyLimitEnabled,
    dailyLimit,
    monthlyLimit,
    dailyLimitUsed,
    monthlyLimitUsed,
    timePeriod,
  ]);

  const {
    basePart: baseCurrentAmountPart,
    decimalPart: decimalCurrentAmountPart,
  } = formatCurrencyParts(current);

  const { basePart: baseLimitAmountPart, decimalPart: decimalLimitAmountPart } =
    formatCurrencyParts(limit);

  const handleOpen = useCallback(() => setOpen(true), []);

  return (
    <div
      className={`flex w-80 flex-col rounded-3xl bg-fill-primary p-4 ${
        !limitsEnabled ? "gap-y-5" : "gap-y-2"
      }`}
    >
      {!limitsEnabled ? (
        <>
          <div className="flex flex-col gap-y-1">
            <span className="text-16-medium text-typography-primary">
              {generateNotDefinedLimitLabel(t, type)}
            </span>
            <span className="text-12-medium text-typography-secondary">
              {t("shared.limits.spendEntireAmount.web")}
            </span>
          </div>
          <div className="flex">
            <Button variant="accent" size="S" onClick={handleOpen}>
              {t("shared.limits.setLimit")}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex">
            <div className="text-20-medium text-typography-primary">
              {baseCurrentAmountPart}
              <span className="text-typography-secondary">
                ,{decimalCurrentAmountPart} {resolveCurrencySign(currency)} /{" "}
              </span>
              {baseLimitAmountPart}
              <span className="text-typography-secondary">
                ,{decimalLimitAmountPart} {resolveCurrencySign(currency)}
              </span>
            </div>
          </div>
          <div
            className={`flex flex-col gap-y-1 text-12-medium ${
              limit <= current
                ? "text-typography-critical"
                : "text-typography-success"
            }`}
          >
            {limit <= current
              ? t("shared.limits.currentLimitReached")
              : generateLimitLeftOverLabel(t, monthlyLimitEnabled, timePeriod)}
            <Progress
              value={
                limit <= current ? 100 : calculatePercentage(limit, current)
              }
              indicatorClassname={
                limit <= current
                  ? "bg-fill-primary-critical"
                  : "bg-fill-primary-success"
              }
            />
          </div>
          <div className="flex gap-x-2.5">
            <div className="text-12-medium text-typography-secondary">
              {t("shared.limits.chooseConvenientLimitPeriod")}
            </div>
            <Button variant="secondary-success" size="S" onClick={handleOpen}>
              {t("common.buttonText.change")}
            </Button>
          </div>
        </>
      )}

      <ChangeAccountLimit
        type={type}
        setOpen={setOpen}
        open={open}
        accountLimit={10000}
      />
    </div>
  );
}
