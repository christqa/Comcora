import { type LimitsDataDTO } from "./limits-types";
import { getLimitsFromStore } from "./limitsStorage";

export const getLimits = async (
  type: string,
  entityId: string
): Promise<LimitsDataDTO | undefined> => {
  await new Promise((r) =>
    setTimeout(r, Math.round(100 + Math.random() * 500))
  );

  return await getLimitsFromStore(type, entityId);
};
