import {
  createTRPCRouter,
  twoLevelsProtectedProcedure,
} from "@/server/trpc/trpc";
import { businessApiControllers } from "@xdatagroup/tbb-sdk";
import { z } from "zod";

export const accountRouter = createTRPCRouter({
  getAccountsSummary: twoLevelsProtectedProcedure.query(async ({ ctx }) => {
    return businessApiControllers.accounts.accountsSummary(ctx.httpClient);
  }),

  getAccountSummary: twoLevelsProtectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return businessApiControllers.accounts.accountSummary(
        input.id,
        ctx.httpClient
      );
    }),

  updateAlias: twoLevelsProtectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        alias: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return businessApiControllers.accounts.patch(
        input.accountId,
        ctx.httpClient,
        {
          alias: input.alias,
        }
      ) as Promise<void>;
    }),

  setCardAlias: twoLevelsProtectedProcedure
    .input(
      z.object({
        cardId: z.string(),
        alias: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return businessApiControllers.cards.patch1(input.cardId, ctx.httpClient, {
        alias: input.alias,
      });
    }),

  updateCard: twoLevelsProtectedProcedure
    .input(
      z.object({
        cardId: z.string(),
        state: z.enum([
          "ACTIVE",
          "EXPIRED",
          "LOST",
          "CLOSED",
          "TEMPORARILY_BLOCKED",
          "BLOCKED_WITH_OVERDUE_DEBT",
          "CLOSED_WITH_OVERDUE_DEBT",
          "LOST_WITH_OVERDUE_DEBT",
          "TEMPORARILY_BLOCKED_WITH_OVERDUE_DEBT",
        ]),
      })
    )
    .mutation(({ ctx, input }) => {
      return businessApiControllers.cards.patch1(input.cardId, ctx.httpClient, {
        cardState: input.state,
      });
    }),
});
