import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/features/login/hooks/LoginContext";
import { api } from "@/features/trpc-client/hooks/react"; // Adjust this import based on your API structure
import { type UserCredentialsDTO } from "@xdatagroup/tbb-sdk/dist/api/services/auth/models";
import { useTranslation } from "react-i18next";

export const usePasswordLoginMethod = () => {
  const { t } = useTranslation();
  const { initProgress, completeProgress, displayError } = useLogin();
  const [ready, setReady] = useState(false);
  const router = useRouter();

  const { mutateAsync: authByPassword } =
    api.auth.initiateSessionByPassword.useMutation();

  const proceed = useCallback(
    async (fields: UserCredentialsDTO) => {
      initProgress();
      try {
        const otpResponse = await authByPassword(fields);
        if (otpResponse.token) {
          completeProgress();
          router.push(`/second-step?otpToken=${otpResponse.token.value}`);
        } else {
          completeProgress();
          displayError({
            message: t("general.anErrorHasOccured"),
            description: t("auth.errors.unableToProceed"),
            retry: () => {
              proceed(fields).catch((error) =>
                console.error("Retry failure:", error)
              );
            },
          });
        }
      } catch (error) {
        console.error("Login failure:", error);
        completeProgress();
        displayError({
          message: t("general.anErrorHasOccured"),
          description: t("auth.errors.authenticationFailed"),
          retry: () => {
            proceed(fields).catch((error) =>
              console.error("Retry failure:", error)
            );
          },
        });
      }
    },
    [initProgress, completeProgress, authByPassword, displayError, router]
  );

  return {
    ready,
    proceed,
  };
};
