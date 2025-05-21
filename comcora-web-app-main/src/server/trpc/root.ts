import { accountRouter } from "@/server/trpc/routers/account";
import { authRouter } from "@/server/trpc/routers/auth";
import { financialInstitutionRouter } from "@/server/trpc/routers/financial-institution";
import { profileRouter } from "@/server/trpc/routers/profile";
import { sessionsRouter } from "@/server/trpc/routers/sessions";
import { storyRouter } from "@/server/trpc/routers/story";
import { transactionRouter } from "@/server/trpc/routers/transaction";
import { createCallerFactory, createTRPCRouter } from "@/server/trpc/trpc";

import { contactsRouter } from "./routers/contacts";
import { paymentsRouter } from "./routers/payments";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  profile: profileRouter,
  account: accountRouter,
  sessions: sessionsRouter,
  transaction: transactionRouter,
  story: storyRouter,
  contacts: contactsRouter,
  payments: paymentsRouter,
  financialInstitution: financialInstitutionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
