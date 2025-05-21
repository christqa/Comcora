import { type FC } from "react";
import DocumentFront from "public/doc-front.png";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type BackToThisDeviceProps = {
  nextStep: () => void;
};

export const BackToThisDevice: FC<BackToThisDeviceProps> = ({ nextStep }) => {
  const { t } = useTranslation();
  const handleContinue = () => {
    nextStep();
  };

  return (
    <div className={"flex h-full flex-col gap-10"}>
      <div className={"flex flex-col items-center gap-4"}>
        <h2 className="text-center text-32-medium text-typography-primary">
          {t("auth.registration.backToThisDevice")}
        </h2>
      </div>
      <div className="w-[339px]">
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-2xl bg-fill-primary p-2">
            <img
              className="w-[132px]"
              src={DocumentFront.src}
              alt="link to phone"
            />
          </div>
          <p className="text-center text-16-medium text-typography-secondary">
            {t("auth.registration.activeSessionElsewhere")}
          </p>
          <div className="flex items-center gap-2 rounded-2xl bg-fill-primary p-2">
            <div className="rounded-2xl bg-fill-secondary-success p-2">
              <Icon
                name="24/Primary/Info"
                className="text-typography-success"
              />
            </div>
            <p className="text-12-medium text-typography-secondary">
              {t("auth.registration.dontCloseWindowHint")}
            </p>
          </div>
          <Button
            className="w-100"
            size={"L"}
            variant="primary-inverse"
            onClick={handleContinue}
          >
            <p className="text-16-medium">
              {t("auth.registration.continueFromThisDevice", {
                device: "IOS, Chrome",
              })}
            </p>
          </Button>
        </div>
      </div>
    </div>
  );
};
