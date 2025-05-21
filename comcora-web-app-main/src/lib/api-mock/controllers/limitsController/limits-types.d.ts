export type LimitsDataDTO = {
  dailyLimit: number;
  dailyLimitUsed: number;
  dailyLimitEnabled: boolean;
  monthlyLimit: number;
  monthlyLimitUsed: number;
  monthlyLimitEnabled: boolean;
};

export type UpdateLimitsPathParams = {
  /**
   * @description Account or Card UUID
   * @type string, string
   */
  entityId: string;
  type: "card" | "account";
};

export type UpdateLimitsMutationRequest = NonNullable<LimitsDataDTO>;
