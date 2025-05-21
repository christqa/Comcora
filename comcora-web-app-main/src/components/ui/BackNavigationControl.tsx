"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Icon } from "./icon";

type BackNavigationControlProps = {
  fallbackPath?: string;
  onClick?: () => void;
};

export function BackNavigationControl(props: BackNavigationControlProps) {
  const { onClick } = props;
  const router = useRouter();
  const { t } = useTranslation();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <a
      {...props}
      className={"flex cursor-pointer items-center gap-2"}
      onClick={handleClick}
    >
      <Icon
        name={"24/Colored/Inverse/Left"}
        className="size-6 text-typography-primary-inverse"
      />
      <span className="text-16-medium text-typography-primary">
        {t("common.buttonText.back")}
      </span>
    </a>
  );
}
