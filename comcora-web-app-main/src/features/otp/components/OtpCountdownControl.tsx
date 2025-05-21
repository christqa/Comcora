"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/features/trpc-client/hooks/react";
import { useTranslation } from "react-i18next";

import { Timer } from "@/components/ui/Timer";

export const OtpCountdownControl = () => {
  const { t } = useTranslation();
  const [timerValue, setTimerValue] = useState(60);
  const { mutateAsync: askForNewCode } = api.auth.askForNewCode.useMutation();
  const searchParams = useSearchParams();
  const otpToken = searchParams.get("otpToken");

  const handleResetTimer = async () => {
    await askForNewCode({ otpToken: otpToken! }).then(() => {
      setTimerValue(60);
    });
  };

  return (
    <Timer key={0} value={timerValue} onComplete={() => setTimerValue(0)}>
      {({ time, active }) =>
        active ? (
          <span className="text-center text-16-medium text-typography-primary">
            {t("auth.confirmation.askNewCodeAfter")}{" "}
            <span className="text-typography-secondary">{time}</span>
          </span>
        ) : (
          <span
            className="cursor-pointer text-center text-16-medium text-typography-success"
            onClick={handleResetTimer}
          >
            {t("auth.confirmation.askNewCode")}
          </span>
        )
      }
    </Timer>
  );
};
