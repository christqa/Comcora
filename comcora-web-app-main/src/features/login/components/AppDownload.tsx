"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { APP_LINK } from "@/lib/constants";
import { Icon } from "@/components/ui/icon";
import { Thumbnail } from "@/components/ui/thumbnail";

export function AppDownload({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <div>
      <div
        className={`mb-4 mt-6 flex flex-col justify-center gap-4 ${className}`}
      >
        <p className="text-center text-12-medium text-typography-disabled">
          {t("downloadApp")}
          <br />
          {t("IosAndroid")}
        </p>
        <div className="flex justify-center gap-4">
          <Link href={APP_LINK.IOS} target="_blank">
            <Thumbnail>
              <Icon name={"24/Logos/Apple"} className="size-6" />
            </Thumbnail>
          </Link>
          <Link href={APP_LINK.ANDROID} target="_blank">
            <Thumbnail>
              <Icon
                name={"24/Logos/GooglePlay"}
                className="size-6 text-typography-primary"
              />
            </Thumbnail>
          </Link>
        </div>
      </div>
    </div>
  );
}
