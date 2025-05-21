import Image from "next/image";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components/ui/icon";
import { Thumbnail } from "@/components/ui/thumbnail";

export default function AppBanner() {
  const { t } = useTranslation();

  return (
    <div
      className={
        "relative w-[376px] overflow-hidden rounded-3xl bg-fill-accent bg-[url('/promo-bg.png')] bg-cover bg-bottom p-5"
      }
    >
      <p
        className={
          "max-w-44 text-20-medium leading-5 text-typography-surface-inverse"
        }
      >
        {t("contacts.alwaysInHand")}
      </p>
      <div className="mt-6 flex gap-2">
        <Thumbnail>
          <Icon name={"24/Logos/GooglePlay"} className="size-6" />
        </Thumbnail>
        <Thumbnail>
          <Icon name={"24/Logos/Apple"} className="size-6" />
        </Thumbnail>
      </div>
      <Image
        priority={false}
        className={"absolute -right-[20%] top-6 w-44 min-w-[267px]"}
        src={"/mockup.png"}
        width={267}
        height={548}
        alt={"phone"}
      />
    </div>
  );
}
