"use client";

import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

import { useLimitsQuery } from "./api/useLimitsQuery";
import { useUpdateLimitsMutation } from "./api/useUpdateLimitsMutation";
import { type LimitsContextType, type TimePeriod } from "./types";

export const LimitsContext = createContext<LimitsContextType>({
  dailyLimit: 0,
  dailyLimitUsed: 0,
  dailyLimitEnabled: false,
  updateDailyLimit: () => Promise.resolve(false),
  monthlyLimit: 0,
  monthlyLimitUsed: 0,
  monthlyLimitEnabled: false,
  updateMonthlyLimit: () => Promise.resolve(false),
  getLimitAmount: () => 0,
  limitsEnabled: false,
  setLimitsEnabled: () => Promise.resolve(),
  selectedTimePeriod: "day",
  setSelectedTimePeriod: (value: TimePeriod) => value,
});

export const LimitsProvider = ({
  children,
  entityId,
  type,
}: PropsWithChildren<{ entityId: string; type: "account" | "card" }>) => {
  const { data } = useLimitsQuery({ entityId, type });
  const { mutateAsync: updateLimits } = useUpdateLimitsMutation();

  const [selectedTimePeriod, setSelectedTimePeriodState] =
    useState<TimePeriod>("day");

  const updateDailyLimit = async (value: number) => {
    if (!data) {
      return false;
    }
    await updateLimits({
      type,
      entityId,
      data: {
        ...data,
        dailyLimit: value,
        dailyLimitEnabled: value > 0,
      },
    });
    return true;
  };

  const updateMonthlyLimit = async (value: number) => {
    if (!data) {
      return false;
    }
    await updateLimits({
      type,
      entityId,
      data: {
        ...data,
        monthlyLimit: value,
        monthlyLimitEnabled: value > 0,
      },
    });
    return true;
  };

  // New function to toggle limits
  const setLimitsEnabled = async (enabled: boolean) => {
    if (!data) return;

    // If disabling, set both limits to 0
    const newDailyLimit = enabled ? data.dailyLimit : 0;
    const newMonthlyLimit = enabled ? data.monthlyLimit : 0;

    await updateLimits({
      type,
      entityId,
      data: {
        ...data,
        dailyLimit: newDailyLimit,
        monthlyLimit: newMonthlyLimit,
        dailyLimitEnabled: enabled ? data.dailyLimitEnabled : false,
        monthlyLimitEnabled: enabled ? data.monthlyLimitEnabled : false,
      },
    });
  };

  const getLimitAmount = (timePeriod: TimePeriod) => {
    switch (timePeriod) {
      case "day":
        return data?.dailyLimit ?? 0;
      case "month":
        return data?.monthlyLimit ?? 0;
      default:
        throw new Error("Invalid limit type: " + type);
    }
  };

  // Set the selected time period
  const setSelectedTimePeriod = (value: TimePeriod) => {
    setSelectedTimePeriodState(value);
  };

  return (
    <LimitsContext.Provider
      value={{
        dailyLimit: data?.dailyLimit ?? 0,
        dailyLimitUsed: data?.dailyLimitUsed ?? 0,
        dailyLimitEnabled: data?.dailyLimitEnabled ?? false,
        updateDailyLimit,
        monthlyLimit: data?.monthlyLimit ?? 0,
        monthlyLimitUsed: data?.monthlyLimitUsed ?? 0,
        monthlyLimitEnabled: data?.monthlyLimitEnabled ?? false,
        updateMonthlyLimit,
        getLimitAmount,
        limitsEnabled:
          data?.dailyLimitEnabled ?? data?.monthlyLimitEnabled ?? false,
        setLimitsEnabled, // Provide the new function to the context
        selectedTimePeriod,
        setSelectedTimePeriod,
      }}
    >
      {children}
    </LimitsContext.Provider>
  );
};

export const useLimits = () => useContext(LimitsContext);
