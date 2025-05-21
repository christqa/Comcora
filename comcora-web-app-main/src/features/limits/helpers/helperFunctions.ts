import { type TFunction } from "i18next";

import { type LimitType, type TimePeriod } from "../lib/types";

export const formatCurrencyParts = (value: number) => {
  const [basePart, decimalPart = "00"] = value.toFixed(2).split(".");
  return { basePart, decimalPart };
};

export const generateLimitLeftOverLabel = (
  t: TFunction,
  monthlyLimitEnabled: boolean,
  period: TimePeriod
): string => {
  return monthlyLimitEnabled
    ? t("shared.limits.timePeriod.month")
    : t(`shared.limits.timePeriod.${period}`);
};

export const generateNotDefinedLimitLabel = (
  t: TFunction,
  property: LimitType
): string => {
  const data = {
    account: t("shared.limits.type.account.web"),
    card: t("shared.limits.type.card.web"),
  };
  return data[property];
};

export const calculatePercentage = (total: number, spent: number) => {
  if (total === 0) return 0;
  return Math.ceil((spent / total) * 100);
};
