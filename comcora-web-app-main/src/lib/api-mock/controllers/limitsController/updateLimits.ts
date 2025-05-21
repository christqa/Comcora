import { type LimitsDataDTO } from "./limits-types";
import { saveLimitsToStore } from "./limitsStorage";

export const updateLimits = async (
  type: string,
  entityId: string,
  data: LimitsDataDTO
): Promise<LimitsDataDTO | undefined> => {
  await new Promise((r) =>
    setTimeout(r, Math.round(100 + Math.random() * 500))
  );

  return saveLimitsToStore(type, entityId, data);
};
