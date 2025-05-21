"use client";

import { useCallback, useState } from "react";
import { useLogin } from "@/features/login/hooks/LoginContext";
import { useSkLoginMethod } from "@/features/login/hooks/useSkLoginMethod";
import { api } from "@/features/trpc-client/hooks/react";
import { type SmartIdDTO } from "@xdatagroup/tbb-sdk/dist/api/services/auth/models";

import { useAuth } from "./useAuth";

export type SmartIdFieldsKeys = "username" | "personalCode";
export type SmartIdErrors = Partial<Record<SmartIdFieldsKeys, boolean>>;
export type SmartIdFields = Record<SmartIdFieldsKeys, string>;

export const useSmartIdLoginMethod = () => {
  const { initProgress, completeProgress, displayChallengeCode, displayError } =
    useLogin();
  const { onLogin } = useAuth();
  const [data, setData] = useState<SmartIdFields>({
    personalCode: "30303039816",
    username: "smirnov_petr",
  });

  const { initiateChallenge } = useSkLoginMethod();
  const { mutateAsync: sessionBySmartId } =
    api.auth.initiateSessionBySmartId.useMutation();
  const { mutateAsync: smartIdStatus } =
    api.auth.checkSmartIdStatus.useMutation({});

  // const { t } = useTranslation();
  const t = (v: string) => v;

  const proceed = useCallback(
    (fields: SmartIdFields) => {
      // const fields = fieldValues.current;
      setData(fields);
      initProgress();
      initiateChallenge({
        initiateRequest: () =>
          sessionBySmartId({
            username: fields.username,
            personalCode: fields.personalCode,
          }),
        onInitiateError: (error) => {
          displayError({
            message: t("general.error.anErrorHasOccurred"),
            description: error.message,
            retry: () => proceed(fields),
          });
        },
        statusRequest: (token) =>
          smartIdStatus({
            sessionToken: `Bearer ${token}`,
          }) as Promise<SmartIdDTO>,
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
          // const newErrors: SmartIdErrors = {};
          // newErrors.username = true;
          // newErrors.personalCode = true;
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
    data,
    proceed,
  };
};
