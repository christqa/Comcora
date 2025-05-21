import {
  createTRPCRouter,
  twoLevelsProtectedProcedure,
} from "@/server/trpc/trpc";
import { businessApiControllers } from "@xdatagroup/tbb-sdk";
import { z } from "zod";

export const financialInstitutionRouter = createTRPCRouter({
  getFiDetails: twoLevelsProtectedProcedure
    .input(
      z.object({
        accountNumber: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return businessApiControllers.financialInstitution.financialInstitutionDetails(
        ctx.httpClient,
        {
          accountNumber: input.accountNumber,
        }
      );
    }),
});
