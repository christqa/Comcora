import { useQuery } from "@tanstack/react-query";

import { mockBusinessApiControllers } from "@/lib/api-mock";

export type LimitsPathParamsDTO = {
  entityId: string;
  type: "account" | "card";
};

export const useLimitsQuery = (params: LimitsPathParamsDTO) =>
  useQuery({
    queryKey: [
      params?.type === "account" ? "accounts" : "cards",
      params?.entityId,
      "limits",
    ],
    queryFn: ({ queryKey }) => {
      const [type, entityId] = queryKey;
      return mockBusinessApiControllers.limits.getLimits(type!, entityId!);
    },
    enabled: !!params?.entityId,
  });
