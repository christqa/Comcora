import { cookies } from "next/headers";
import { buildBrowserIdentifier, generateNonce } from "@/server/quick-login";
import { session } from "@/server/session";
import {
  createTRPCRouter,
  oneLevelProtectedProcedure,
  publicProcedure,
  twoLevelsProtectedProcedure,
} from "@/server/trpc/trpc";
import { type TokenRotateResponse } from "@/types/auth-service.types";
import { TRPCError } from "@trpc/server";
import { authApiControllers } from "@xdatagroup/tbb-sdk";
import QRCode from "qrcode";
import { z } from "zod";

import { passwordSchema } from "@/lib/validators/comcora-password";
import { comcoraUsernameSchema } from "@/lib/validators/comcora-username";
import { estonianIdSchema } from "@/lib/validators/estonian-id-code";
import { mobilePhoneSchema } from "@/lib/validators/mobile-phone";

export const authRouter = createTRPCRouter({
  logout: publicProcedure.mutation(async ({ input, ctx }) => {
    const { httpClient } = ctx;
    void session().destroy();
    cookies().delete("TBB_SID");
    try {
      await authApiControllers.authentication.logout(httpClient);
    } catch (error) {
      console.error("An unexpected error occured.", error);
      return { success: false, message: "An unexpected error occured." };
    }
  }),
  checkSmartIdStatus: publicProcedure
    .input(z.object({ sessionToken: z.string().min(10) }))
    .mutation(async ({ input, ctx }) => {
      const { httpClient } = ctx;
      const result = await authApiControllers.skIdAuthentication.smartIdStatus(
        httpClient,
        { Authorization: input.sessionToken }
      );
      if (result.status === "OK") {
        await session().setAll({
          ...result.authentication!,
          browserIdentifier: buildBrowserIdentifier(ctx.headers),
        });
        return {
          status: result.status,
        };
      }
      return result;
    }),
  askForNewCode: publicProcedure
    .input(z.object({ otpToken: z.string().min(10) }))
    .mutation(async ({ input, ctx }) => {
      const { httpClient } = ctx;
      try {
        await authApiControllers.oneTimePasswordOtp.handleOtp(httpClient);
      } catch (error) {
        console.error("An unexpected error occured.", error);
        return { success: false, message: error };
      }
    }),
  verifyOtpCode: publicProcedure
    .input(
      z.object({ otpToken: z.string().min(10), code: z.string().length(6) })
    )
    .mutation(async ({ input, ctx }) => {
      const { httpClient } = ctx;

      try {
        const result = await authApiControllers.authentication.token(
          httpClient,
          { code: Number(input.code) },
          {
            headers: {
              Authorization: `Bearer ${input.otpToken}`,
            },
          }
        );

        if (result.accessToken && result.refreshToken) {
          await session().set("accessToken", result.accessToken);
          await session().set("refreshToken", result.refreshToken);

          return {
            success: true,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          };
        }

        return {
          success: false,
          message: "Authentication failed",
        };
      } catch (error) {
        return {
          success: false,
          message: error,
        };
      }
    }),

  initiateSessionBySmartId: publicProcedure
    .input(
      z.object({
        username: comcoraUsernameSchema,
        personalCode: estonianIdSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { httpClient } = ctx;
      const { username, personalCode } = input;
      const result =
        await authApiControllers.skIdAuthentication.sessionBySmartId(
          httpClient,
          {
            username,
            personalCode,
          }
        );
      return result;
    }),

  checkMobileIdStatus: publicProcedure
    .input(z.object({ sessionToken: z.string().min(10) }))
    .mutation(async ({ input, ctx }) => {
      const { httpClient } = ctx;
      const result = await authApiControllers.skIdAuthentication.mobileIdStatus(
        httpClient,
        { Authorization: input.sessionToken }
      );
      if (result.status === "OK") {
        await session().setAll({
          ...result.authentication!,
          browserIdentifier: buildBrowserIdentifier(ctx.headers),
        });
        return {
          status: result.status,
        };
      }
      return result;
    }),

  initiateSessionByMobileId: publicProcedure
    .input(
      z.object({ username: comcoraUsernameSchema, phone: mobilePhoneSchema })
    )
    .mutation(async ({ input, ctx }) => {
      const { httpClient } = ctx;
      const { username, phone } = input;
      const result =
        await authApiControllers.skIdAuthentication.sessionByMobileId(
          httpClient,
          {
            username,
            phoneNumber: phone,
          }
        );
      return result;
    }),
  initiateSessionByPassword: publicProcedure
    .input(
      z.object({ username: comcoraUsernameSchema, password: passwordSchema })
    )
    .mutation(async ({ input, ctx }) => {
      const { httpClient } = ctx;
      const { username, password } = input;
      const result = await authApiControllers.authentication.authByPassword(
        httpClient,
        {
          username,
          password,
        }
      );
      return result;
    }),

  createNonce: oneLevelProtectedProcedure.mutation(async ({ ctx }) => {
    const { axios } = ctx;
    if (await session().get("encryptedAccessPin")) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Pin already configured",
      });
    }

    const accessNonce = generateNonce();
    const resetNonce = generateNonce();
    //await session().set("nonce", nonce);
    return {
      access: accessNonce,
      reset: resetNonce,
    };
  }),

  setEncryptedPin: oneLevelProtectedProcedure
    .input(
      z.object({
        accessPin: z.string().min(10),
        resetPin: z.string().min(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { axios } = ctx;
      if (await session().get("encryptedAccessPin")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Pin already configured",
        });
      }

      await session().set("encryptedAccessPin", input.accessPin);
      await session().set("encryptedResetPin", input.resetPin);

      return {
        success: true,
      };
    }),

  checkEncryptedPin: oneLevelProtectedProcedure
    .input(
      z.object({
        pin: z.string().min(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!(await session().get("encryptedAccessPin"))) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Pin not configured",
        });
      }

      const expected = await session().get("encryptedAccessPin");

      return {
        success: expected === input.pin,
      };
    }),

  requestPinReset: twoLevelsProtectedProcedure
    .input(
      z.object({
        pin: z.string().min(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const expected = await session().get("encryptedResetPin");
      const accessNonce = generateNonce();
      const resetNonce = generateNonce();
      return {
        success: expected === input.pin,
        access: accessNonce,
        reset: resetNonce,
      };
    }),

  confirmPinReset: twoLevelsProtectedProcedure
    .input(
      z.object({
        currentPin: z.string().min(10),
        accessPin: z.string().min(10),
        resetPin: z.string().min(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const expected = await session().get("encryptedResetPin");
      if (expected !== input.currentPin) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid pin" });
      }
      await session().set("encryptedAccessPin", input.accessPin);
      await session().set("encryptedResetPin", input.resetPin);
      return {
        success: true,
      };
    }),

  requestQrCode: publicProcedure.mutation<{
    data_url: string;
    sessionId: string;
  }>(async ({ ctx }) => {
    const { sessionId, sessionToken } =
      await authApiControllers.qrCodeAuthentication.requestSessionId(
        ctx.httpClient
      );

    return {
      sessionId: sessionId,
      data_url: await QRCode.toDataURL("tbb-dev://authorise/" + sessionToken, {
        width: 192 * 3,
        color: {
          light: "#f6f6f6",
          dark: "#010101",
        },
      }),
    };
  }),

  authenticateQrCode: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation<{
      success: boolean;
    }>(async ({ ctx, input }) => {
      try {
        const result =
          await authApiControllers.qrCodeAuthentication.authenticateSessionId(
            input.sessionId,
            ctx.httpClient
          );
        if (result?.accessToken) {
          const { accessToken, refreshToken } = result;
          await session().set("accessToken", accessToken);
          await session().set("refreshToken", refreshToken);
          return {
            success: true,
          };
        }

        const resultAsTokenAction = result as unknown as TokenRotateResponse;

        return {
          success: false,
          status: resultAsTokenAction.status,
          data_url: resultAsTokenAction.token
            ? await QRCode.toDataURL(
                "tbb-dev://authorise/" + resultAsTokenAction.token,
                {
                  width: 192 * 3,
                  color: {
                    light: "#f6f6f6",
                    dark: "#010101",
                  },
                }
              )
            : undefined,
        };
      } catch (e) {
        console.log("error", e);
        return {
          success: false,
        };
      }
    }),
});
