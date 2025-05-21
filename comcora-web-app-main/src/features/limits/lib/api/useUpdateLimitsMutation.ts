import { useMutation, useQueryClient } from "@tanstack/react-query";

import { mockBusinessApiControllers } from "@/lib/api-mock";
import {
  type UpdateLimitsMutationRequest,
  type UpdateLimitsPathParams,
} from "@/lib/api-mock/controllers/limitsController/limits-types";

export const useUpdateLimitsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      entityId,
      type,
      data,
    }: {
      entityId: UpdateLimitsPathParams["entityId"];
      type: UpdateLimitsPathParams["type"];
      data: UpdateLimitsMutationRequest;
    }) =>
      mockBusinessApiControllers.limits
        .updateLimits(type, entityId, data)
        .then(() => ({
          entityId,
          data,
          type,
        })),
    onSuccess: (data) => {
      return queryClient.invalidateQueries({
        queryKey: [
          data?.type === "account" ? "accounts" : "cards",
          data.entityId,
          "limits",
        ],
        exact: true,
      });
    },
  });
};
