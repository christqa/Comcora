"use client";

import { usePathname, useSelectedLayoutSegments } from "next/navigation";

import { cn } from "@/lib/utils";

export const DynamicInnerBackground = () => {
  const segments = useSelectedLayoutSegments();
  const pathname = usePathname();

  const isMainPage = segments.length === 1 && segments[0] === "(main)";

  const isPaymentSuccessPage =
    pathname.includes("private/payments/success") ||
    pathname.includes("request-money/content");

  const backgroundImageClass = isPaymentSuccessPage
    ? "bg-[url('/layout-bg.png')] bg-[length:100%_500px] bg-no-repeat h-[30rem] dark:bg-[url('/layout-bg-dark.jpg')]"
    : "bg-[url('/inner-bg.jpg')] bg-cover bg-center bg-no-repeat dark:bg-[url('/inner-bg-dark.png')]";

  const isBackgroundImage =
    isPaymentSuccessPage || isMainPage ? backgroundImageClass : "";
  return (
    <div
      className={cn(
        `pointer-events-none fixed left-0 top-0 h-[22.5rem] w-full ${isBackgroundImage}`
      )}
    ></div>
  );
};
