import {
  createTRPCRouter,
  twoLevelsProtectedProcedure,
} from "@/server/trpc/trpc";
import { authApiControllers } from "@xdatagroup/tbb-sdk";
import { z } from "zod";

export const sessionsRouter = createTRPCRouter({
  listSessions: twoLevelsProtectedProcedure.query(({ ctx }) => {
    return authApiControllers.session.listSessions(ctx.httpClient);
  }),
  endSession: twoLevelsProtectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return authApiControllers.session.endSession(ctx.httpClient, {
        sessionId: input.sessionId,
      });
    }),

  endAllSessions: twoLevelsProtectedProcedure.mutation(({ ctx }) => {
    return authApiControllers.session.endAllSessions(ctx.httpClient);
  }),
});
