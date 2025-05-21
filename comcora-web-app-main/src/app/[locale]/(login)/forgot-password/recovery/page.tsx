"use client";

import { SelectRecoveryMethodFlow } from "@/features/localisation/components/SelectRecoveryMethodFlow";
import GoToMain from "@/features/login/components/GoToMain";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();

  return (
    <SelectRecoveryMethodFlow className="relative flex w-[26.5rem] flex-col gap-y-8 rounded-5xl bg-fill-background-main p-8">
      <GoToMain />
      <div className="flex flex-col gap-y-4">
        <h4 className="text-center text-32-medium text-typography-primary">
          {t("auth.forgotPassword.chooseAuthMethod")}
        </h4>
      </div>
    </SelectRecoveryMethodFlow>
  );
}
