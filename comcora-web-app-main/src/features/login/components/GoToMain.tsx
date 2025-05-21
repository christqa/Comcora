"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components/ui/icon";
import { Thumbnail } from "@/components/ui/thumbnail";

export default function GoToMain() {
  const { t } = useTranslation();

  return (
    <Link className="inline-flex items-center gap-x-4" href={"/"}>
      <Thumbnail>
        <Icon
          name={"24/Colored/Light/Left"}
          className="mx-auto size-6 self-center"
        />
      </Thumbnail>
      <span className="grow text-16-medium text-typography-primary">
        {t("general.goToHomeScreen.web")}
      </span>
    </Link>
  );
}
