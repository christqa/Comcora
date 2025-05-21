import {
  createTRPCRouter,
  twoLevelsProtectedProcedure,
} from "@/server/trpc/trpc";
import { businessApiControllers } from "@xdatagroup/tbb-sdk";
import { z } from "zod";

export const paymentsRouter = createTRPCRouter({
  calculateFee: twoLevelsProtectedProcedure
    .input(
      z.object({
        beneficiaryRequisiteId: z.string(),
        beneficiaryAccountNumber: z.string(),
        beneficiaryCountryCode: z.string(),
        amount: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return businessApiControllers.payments.calculatePaymentOrderFee(
        ctx.httpClient,
        input
      );
    }),
  createPayment: twoLevelsProtectedProcedure
    .input(
      z.object({
        originatorRequisiteId: z.string(),
        beneficiaryRequisiteId: z.string(),
        amount: z.number(),
        reference: z.string().optional(),
        referenceId: z.string().optional(),
        attachmentUrl: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return businessApiControllers.payments.paymentInitiate(
        ctx.httpClient,
        input
      );
    }),
  findOrderDetails: twoLevelsProtectedProcedure
    .input(
      z.object({
        paymentId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return businessApiControllers.payments.findOrder(
        input.paymentId,
        ctx.httpClient
      );
    }),
  getTransactionById: twoLevelsProtectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return businessApiControllers.financialOperations.financialOperation(
        input.id,
        ctx.httpClient
      );
    }),
});
