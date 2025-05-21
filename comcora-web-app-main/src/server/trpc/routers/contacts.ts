import {
  createTRPCRouter,
  twoLevelsProtectedProcedure,
} from "@/server/trpc/trpc";
import { businessApiControllers } from "@xdatagroup/tbb-sdk";
import { z } from "zod";

export const contactsRouter = createTRPCRouter({
  getContactsList: twoLevelsProtectedProcedure.query(async ({ ctx }) => {
    return businessApiControllers.contacts.contacts(ctx.httpClient);
  }),

  createContact: twoLevelsProtectedProcedure
    .input(
      z.object({
        type: z.enum(["PRIVATE", "COMPANY"]),
        country: z.string(),
        currency: z.string(),
        name: z.string(),
        accountNumber: z.string(),
        email: z.string().email().optional().or(z.literal("")),
      })
    )
    .mutation(({ ctx, input }) => {
      return businessApiControllers.contacts.createContactWithRequisite(
        ctx.httpClient,
        {
          name: input.name.trim(),
          country: input.country,
          currency: input.currency,
          type: input.type,
          accountNumber: input.accountNumber,
          email: input.email,
        }
      );
    }),

  getContact: twoLevelsProtectedProcedure
    .input(z.object({ contactId: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log(input.contactId);
      const ret = businessApiControllers.contacts.contact(
        input.contactId,
        ctx.httpClient
      );
      console.log(ret, "kjshdksjdfhkjsdhgksjdghksdjghksdjh");
      return businessApiControllers.contacts.contact(
        input.contactId,
        ctx.httpClient
      );
    }),

  getFavourites: twoLevelsProtectedProcedure.query(async ({ ctx }) => {
    return businessApiControllers.contacts.contacts(ctx.httpClient, {
      favourite: true,
    });
  }),

  updateContact: twoLevelsProtectedProcedure
    .input(
      z.object({
        contactId: z.string(),
        type: z.enum(["PRIVATE", "COMPANY"]).optional(),
        name: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
        isFavourite: z.boolean().optional(),
        paymentRequisites: z
          .array(
            z.object({
              country: z.string().optional(),
              currency: z.string().optional(),
              accountNumber: z.string().optional(),
              name: z.string().optional(),
              email: z.string().optional(),
              type: z.enum(["PRIVATE", "COMPANY"]).optional(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return businessApiControllers.contacts.updateContact(
        input.contactId,
        ctx.httpClient,
        input
      );
    }),

  deleteContact: twoLevelsProtectedProcedure
    .input(z.object({ contactId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return businessApiControllers.contacts.deleteContact(
        input.contactId,
        ctx.httpClient
      );
    }),

  deleteContactRequisite: twoLevelsProtectedProcedure
    .input(
      z.object({
        contactId: z.string(),
        requisiteId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return businessApiControllers.contacts.deletePaymentRequisite(
        input.contactId,
        input.requisiteId,
        ctx.httpClient
      );
    }),
});
