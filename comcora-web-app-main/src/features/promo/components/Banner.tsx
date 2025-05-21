import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { APP_LINK } from "@/lib/constants";

const Banner = () => {
  const { t } = useTranslation();

  return (
    <div
      className={
        "relative flex h-[120px] items-center justify-between overflow-hidden rounded-3xl bg-banner-gradient p-6"
      }
    >
      <Image
        src={"/promo-phone.png"}
        width={330}
        height={115}
        alt={"Phone"}
        className={"absolute left-1/2 top-0 -translate-x-1/2"}
      />
      <div className="relative z-10 flex max-w-[242px] flex-col gap-2">
        <p
          className={"text-24-medium leading-6 text-typography-surface-inverse"}
        >
          {t("banner.title")}
        </p>
        <span className={"text-12-medium text-typography-surface-inverse"}>
          {t("banner.desc")}
        </span>
      </div>
      <div className="relative z-10 flex shrink-0 flex-col justify-center gap-2">
        <Link href={APP_LINK.IOS} target="_blank">
          <Image
            priority={false}
            src={"/appstore-download.svg"}
            fetchPriority={"low"}
            width={124}
            height={32}
            alt={"appstore"}
          />
        </Link>
        <Link href={APP_LINK.ANDROID} target="_blank">
          <Image
            priority={false}
            src={"/android-download.svg"}
            fetchPriority={"low"}
            width={124}
            height={32}
            alt={"android"}
          />
        </Link>
      </div>
    </div>
  );
};

export default Banner;
