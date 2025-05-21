import { type Transaction } from "@/features/transactions/lib/transaction";
import {
  createTRPCRouter,
  twoLevelsProtectedProcedure,
} from "@/server/trpc/trpc";
import { businessApiControllers } from "@xdatagroup/tbb-sdk";
import { adaptFinancialOperation } from "@xdatagroup/tbb-sdk/dist/api/adapters/adaptFinancialOperation";
import {
  type FinancialOperationsDirectionDTO,
  type FinancialOperationsFilterTypeDTO,
} from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import { z } from "zod";

import { randomId } from "@/lib/random-id";

export const ensureUniqueId = (item: Transaction) => {
  item.id = item.id + "_" + item.date + randomId();
  return item;
};

export const transactionRouter = createTRPCRouter({
  getTransactions: twoLevelsProtectedProcedure
    .input(
      z.object({
        accountIds: z.array(z.string()).optional(),
        cardIds: z.array(z.string()).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        type: z.array(z.string()).optional(),
        operationType: z.string().optional(),
        count: z.number().optional(),
        keyword: z.string().optional(),
        cursor: z.number().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        accountIds = [],
        cardIds = [],
        startDate = "",
        endDate = "",
        type = [],
        operationType = "",
        count,
        keyword = "",
        offset,
      } = input;

      const response =
        await businessApiControllers.financialOperations.financialOperations(
          ctx.httpClient,
          {
            accountIds: accountIds,
            cardIds: cardIds,
            types: type as FinancialOperationsFilterTypeDTO[],
            direction: operationType as FinancialOperationsDirectionDTO,
            startDate: startDate || "2021-01-19",
            endDate,
            count: count,
            keyword,
            offset,
          }
        );

      return response.map(adaptFinancialOperation);
    }),
});
