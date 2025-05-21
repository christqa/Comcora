import { type LimitsDataDTO } from "./limits-types";

const mockDataStore: Record<string, LimitsDataDTO> = {};

const generateMockData = (): LimitsDataDTO => {
  const dailyLimitUsed = Math.random() * 300;
  return {
    dailyLimit: 300,
    dailyLimitUsed: dailyLimitUsed,
    dailyLimitEnabled: Math.random() > 0.5,
    monthlyLimit: 2000,
    monthlyLimitUsed: Math.random() * (2000 - dailyLimitUsed * 1.5),
    monthlyLimitEnabled: Math.random() > 0.5,
  };
};

export const getLimitsFromStore = (
  type: string,
  entityId: string
): Promise<LimitsDataDTO | undefined> => {
  const entityKey = `${type[0]}-${entityId[1]}`;
  if (!mockDataStore[entityKey]) {
    mockDataStore[entityKey] = generateMockData();
  }
  return Promise.resolve(mockDataStore[entityKey]);
};

export const saveLimitsToStore = async (
  type: string,
  entityId: string,
  data: LimitsDataDTO
): Promise<LimitsDataDTO | undefined> => {
  const entityKey = `${type[0]}-${entityId[1]}`;

  mockDataStore[entityKey] = {
    ...(await getLimitsFromStore(type, entityId)),
    ...data,
  };

  return Promise.resolve(mockDataStore[entityKey]);
};
