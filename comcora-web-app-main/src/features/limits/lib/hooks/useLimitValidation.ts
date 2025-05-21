import { type TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { useLimits } from "../LimitsContext";
import { type TimePeriod } from "../types";

const generateLimitLabel = (t: TFunction, timePeriod: TimePeriod) => {
  const labels = {
    day: t("shared.limits.onEachDay"),
    month: t("shared.limits.onEachMonth"),
  };

  return labels[timePeriod];
};

export const useLimitValidation = (value: number, timePeriod: TimePeriod) => {
  const { dailyLimit, dailyLimitEnabled, monthlyLimit, monthlyLimitEnabled } =
    useLimits();
  const { t } = useTranslation();

  let label = "";
  if (value) {
    switch (timePeriod) {
      case "day":
        if (monthlyLimitEnabled && value > monthlyLimit) {
          label = t(
            "shared.limits.messages.dailyLimitCantBeGreaterThanMonthly"
          );
        }
        break;
      case "month":
        if (dailyLimitEnabled && dailyLimit > value) {
          label = t("shared.limits.messages.monthlyLimitCantBeLessThanDaily");
        }
        break;
      default:
        throw new Error("Invalid limit type: " + (timePeriod as string));
    }
  }

  const valid = label === "";
  if (valid) {
    label = generateLimitLabel(t, timePeriod) || "";
  }

  return { label, valid };
};
