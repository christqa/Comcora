import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { APP_LINK } from "@/lib/constants";

export function PromoBanner() {
  const { t } = useTranslation();

  return (
    <section className="relative flex min-h-[12.875rem] w-full overflow-hidden rounded-3xl bg-fill-accent bg-[url('/promo-bg.png')] bg-cover bg-bottom p-6">
      <Image
        priority={false}
        src="/promo-bg.png"
        fetchPriority="low"
        alt="promo-bg"
        fill={true}
        style={{
          objectFit: "cover",
          objectPosition: "bottom",
          zIndex: -1,
        }}
      />
      <div className="flex w-40 shrink-0 flex-col justify-between gap-5">
        <p className="text-32-medium text-typography-surface-inverse">
          {t("home.promoBanner.mobileAppTitle")}
        </p>
        <span className="text-16-medium leading-5 text-typography-surface-inverse">
          {t("home.promoBanner.downloadApp")}
        </span>
      </div>
      <div className="flex flex-1 justify-end gap-10">
        <div className="relative -bottom-6 max-h-full w-full max-w-[15.5rem] shrink-0">
          <Image
            priority={false}
            src="/mockup.png"
            fetchPriority="low"
            alt="mockup"
            fill={true}
            style={{
              objectFit: "contain",
              objectPosition: "bottom",
            }}
          />
        </div>
        <div className="flex shrink-0 flex-col justify-center gap-2">
          <Link href={APP_LINK.IOS} target="_blank">
            <Image
              priority={false}
              className={"size-full"}
              src={"/appstore-download.svg"}
              fetchPriority={"low"}
              width={140}
              height={40}
              alt={"appstore"}
            />
          </Link>
          <Link href={APP_LINK.ANDROID} target="_blank">
            <Image
              priority={false}
              className={"size-full"}
              src={"/android-download.svg"}
              fetchPriority={"low"}
              width={140}
              height={40}
              alt={"android"}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
