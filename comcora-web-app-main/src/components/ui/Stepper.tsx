"use client";

import { useTranslation } from "react-i18next";

interface StepperProps {
  stepsCount: number;
  step: number;
}

export const Stepper = ({ stepsCount, step }: StepperProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-fit rounded-xl bg-fill-secondary px-3 py-2">
      <span className="text-14-medium text-typography-primary">
        {t("auth.registration.step")} {step} {t("auth.registration.from")}{" "}
        {stepsCount}
      </span>
    </div>
  );
};
