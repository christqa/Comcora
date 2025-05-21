"use client";

import { useCallback } from "react";
import { useLogin } from "@/features/login/hooks/LoginContext";
import { useSkLoginMethod } from "@/features/login/hooks/useSkLoginMethod";
import { api } from "@/features/trpc-client/hooks/react";
import { type MobileIdDTO } from "@xdatagroup/tbb-sdk/dist/api/services/auth/models";

import { useAuth } from "./useAuth";

export type MobileIdFieldsKeys = "username" | "phoneNumber";
export type MobileIdErrors = Partial<Record<MobileIdFieldsKeys, boolean>>;
export type MobileIdFields = Record<MobileIdFieldsKeys, string>;

export const useMobileIdLoginMethod = () => {
  const { initProgress, completeProgress, displayChallengeCode, displayError } =
    useLogin();
  const { onLogin } = useAuth();
  const { initiateChallenge } = useSkLoginMethod();
  const { mutateAsync: sessionByMobileId } =
    api.auth.initiateSessionByMobileId.useMutation();

  const { mutateAsync: mobileIdStatus } =
    api.auth.checkMobileIdStatus.useMutation();

  // const { t } = useTranslation();
  const t = (v: string) => v;

  const proceed = useCallback(
    (fields: MobileIdFields) => {
      initProgress();
      initiateChallenge({
        initiateRequest: () =>
          sessionByMobileId({
            username: fields.username,
            phone: fields.phoneNumber,
          }),
        onInitiateError: (error) => {
          console.log(error);
          // if (newErrors.username || newErrors.phone) {
          //   completeProgress();
          //   return;
          // }
          displayError({
            message: t("general.error.anErrorHasOccurred"),
            description: error.message,
            retry: () => proceed(fields),
          });
        },
        statusRequest: (token) =>
          mobileIdStatus({
            sessionToken: `Bearer ${token}`,
          }) as Promise<MobileIdDTO>,
        onCodeReceived: (code) => {
          displayChallengeCode(code);
        },
        onComplete: () => {
          completeProgress();
          onLogin();
        },
        onReject: (error) => {
          console.log("Got an error", error);
          displayError({
            message: t("general.error.anErrorHasOccurred"),
            description: t("auth.error.authErrorMessageDescription"),
            retry: () => proceed(fields),
          });
        },
        onUnauthorised: () => {
          // const newErrors: MobileIdErrors = {};
          // newErrors.username = true;
          // newErrors.phone = true;
          // setErrors(newErrors);
          completeProgress();
        },
      });
    },
    [
      completeProgress,
      displayChallengeCode,
      displayError,
      initProgress,
      onLogin,
      t,
    ]
  );

  return {
    proceed,
  };
};
