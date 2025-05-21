import { useTranslation } from "react-i18next";

import { BackNavigationControl } from "@/components/ui/BackNavigationControl";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type ChallengeCodeProps = {
  value: string;
  onDismiss: () => void;
  isBackButton?: boolean;
  isButton?: boolean;
};
export function ChallengeCode(props: ChallengeCodeProps) {
  const { value, isBackButton, isButton } = props;
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col justify-center gap-y-10 bg-fill-background-main p-2">
      <div className={"fixed left-0 top-28 px-8"}>
        {isBackButton && <BackNavigationControl fallbackPath={"/"} />}
      </div>
      <div className="flex items-center justify-center">
        <Icon className={"size-10 animate-spin"} name={"40/Accent/Preloader"} />
      </div>
      <div className="flex flex-col justify-center gap-y-4">
        <h4 className="challenge-code text-center text-40-medium text-typography-primary">
          {value}
        </h4>
        <p className="text-center text-16-medium text-typography-secondary">
          {t("auth.pinSetUp.requestHasBeenSentOnYourDevice")}{" "}
          {t("auth.pinSetUp.compareTheCodesAndEnterPin1")}
        </p>
      </div>
      {isButton && (
        <Button
          variant={"primary-inverse"}
          size={"M"}
          className={"mx-auto w-32"}
          disabled
        >
          {t("common.buttonText.update")}
        </Button>
      )}
    </div>
  );
}
