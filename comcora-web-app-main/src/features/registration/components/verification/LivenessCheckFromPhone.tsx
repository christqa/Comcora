import { type FC } from "react";
import QrCode from "public/qrCode.png";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type LivenessCheckFromPhoneProps = {
  nextLocalStep: () => void;
};

export const LivenessCheckFromPhone: FC<LivenessCheckFromPhoneProps> = ({
  nextLocalStep,
}) => {
  const { t } = useTranslation();

  //   useEffect(() => {
  //     setTimeout(() => {
  //       nextLocalStep();
  //     }, 5000);
  //   });

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText("exp+tbb-app://registration")
      .then(() => console.log("copied"))
      .catch((err) => console.error(err));

    setTimeout(() => {
      nextLocalStep();
    }, 2000);
  };
  return (
    <div className={"flex h-full flex-col gap-10"}>
      <div className={"flex flex-col items-center gap-4"}>
        <h2 className="text-center text-32-medium text-typography-primary">
          {t("auth.registration.doLivenessCheck")}
        </h2>
      </div>
      <div className="w-[383px]">
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-2xl bg-fill-primary p-2">
            <img className="w-[132px]" src={QrCode.src} alt="link to phone" />
          </div>
          <p className="text-center text-16-medium text-typography-secondary">
            {t("auth.registration.scanQrOrCopyLink")}
          </p>
          <div className="flex items-center gap-2 rounded-2xl bg-fill-primary p-2">
            <Icon name="24/Primary/Link" />
            <div className="max-w-[205px] overflow-hidden text-ellipsis text-nowrap">
              https://www.comcora.com/results?search_query=%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81+%D0%B4%D0%B5%D0%BD%D0%B5%D0%B3+%D0%B2+%D1%81%D0%B1%D0%B5%D1%80%D0%B1%D0%B0%D0%BD%D0%BA+%D1%81+%D0%BA%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%D0%B0
            </div>
            <Button onClick={handleCopyClick} variant="accent">
              {t("common.buttonText.copy")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
