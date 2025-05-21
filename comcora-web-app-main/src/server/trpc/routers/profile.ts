import {
  userAddressValidationScheme,
  userAliasValidationScheme,
  userEmailValidationScheme,
  userPhoneValidationScheme,
} from "@/features/profile/lib/profile-validation-schemes";
import {
  createTRPCRouter,
  twoLevelsProtectedProcedure,
} from "@/server/trpc/trpc";
import { businessApiControllers } from "@xdatagroup/tbb-sdk";
import { z } from "zod";

export const profileRouter = createTRPCRouter({
  retrieve: twoLevelsProtectedProcedure.query(async ({ ctx }) => {
    return businessApiControllers.userProfile.getProfile(ctx.httpClient);
  }),

  updateComcoraId: twoLevelsProtectedProcedure
    .input(
      z.object({
        userAlias: userAliasValidationScheme,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return businessApiControllers.userApi.changeUserAlias(ctx.httpClient, {
        userAlias: input.userAlias,
      });
    }),

  updateEmail: twoLevelsProtectedProcedure
    .input(
      z.object({
        email: userEmailValidationScheme,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return businessApiControllers.userApi.changeUserEmail(ctx.httpClient, {
        email: input.email,
      });
    }),

  updatePhone: twoLevelsProtectedProcedure
    .input(
      z.object({
        phoneNumber: userPhoneValidationScheme,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return businessApiControllers.userApi.changeUserPhone(ctx.httpClient, {
        phoneNumber: input.phoneNumber,
      });
    }),

  updateAddress: twoLevelsProtectedProcedure
    .input(
      z.object({
        address: userAddressValidationScheme,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return businessApiControllers.userApi.changeUserPostalAddress(
        ctx.httpClient,
        input.address
      );
    }),

  // updatePhoto: twoLevelsProtectedProcedure
  //   .input(userAvatarValidationScheme)
  //   .mutation(async (opts) => {
  //     console.log(opts.input);
  //     return {
  //       name: opts.input.name,
  //       // image: await writeFileToDisk(opts.input.formData.image),
  //     };
  //   }),
});
