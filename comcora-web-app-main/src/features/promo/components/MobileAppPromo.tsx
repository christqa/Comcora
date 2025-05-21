"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

export function MobileAppPromo() {
  const { theme } = useTheme();

  return (
    <section className={"relative flex min-h-[37.2rem] w-full items-center"}>
      <div className={"pl-10 pt-10"}>
        <h3 className={"text-32-medium text-typography-secondary"}>
          Мобильный банк <br />
          на каждый день
        </h3>

        <p className={"mt-4 text-12-medium text-typography-secondary"}>
          Установите Comcora Bank на свой мобильный телефон <br /> и управляйте
          финансами где и когда угодно
        </p>

        <Image
          priority={false}
          className={"mt-8"}
          src={"/app-install-qr.png"}
          width={136}
          height={136}
          alt={"qr"}
        />

        <p className={"mt-4 text-12-medium text-typography-secondary"}>
          Отсканируйте QR-код, чтобы <br />
          скачать приложение
        </p>
      </div>
      <Image
        priority={false}
        className={"absolute -right-18 top-9"}
        src={theme === "dark" ? "/app-preview-dark.png" : "/app-preview.png"}
        fetchPriority={"low"}
        width={358}
        height={597}
        alt={"qr"}
      />
    </section>
  );
}
