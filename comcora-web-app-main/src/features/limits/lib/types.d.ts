export type TimePeriod = "day" | "month";
export interface LimitsContextType {
  dailyLimit: number;
  dailyLimitUsed: number;
  dailyLimitEnabled: boolean;
  updateDailyLimit: (value: number) => Promise<boolean>;
  monthlyLimit: number;
  monthlyLimitUsed: number;
  monthlyLimitEnabled: boolean;
  updateMonthlyLimit: (value: number) => Promise<boolean>;
  getLimitAmount: (timePeriod: TimePeriod) => number;
  limitsEnabled: boolean;
  setLimitsEnabled: (enabled: boolean) => Promise<void>;
  selectedTimePeriod: TimePeriod;
  setSelectedTimePeriod: (timePeriod: TimePeriod) => void;
}

export type CreditCardType = "visa" | "mc" | "up";

export type LimitType = "card" | "account";

export interface CreditCard {
  id: string;
  type: CreditCardType;
  lastDigits?: string;
  fullCardNumber?: string;
  cvcCode?: string;
  expires?: number;
  cardTitle?: string;
  frozen?: boolean;
  accountId?: string;
  backgroundStyle?: {
    coverId: string;
    backgroundColor: string;
  };
}
