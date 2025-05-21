"use client";

import { useAuth } from "@/features/login/hooks/AuthContext";
import { api } from "@/features/trpc-client/hooks/react";
import { useTranslation } from "react-i18next";

import { Skeleton } from "@/components/ui/skeleton";

export function WelcomeMessage() {
  const { encryptedAccessPin } = useAuth();
  const { t } = useTranslation();

  const { data } = api.profile.retrieve.useQuery(undefined, {
    enabled: Boolean(encryptedAccessPin),
  });

  const today = new Date();
  const [name] = data?.fullName.split(" ") ?? [];

  const formattedDate = `${today.getDate()} ${t(
    "dates.month.longQuantified." + (today.getMonth() + 1)
  )}, ${today.getFullYear()}`;

  return (
    <section className="flex flex-col justify-center gap-y-2">
      {!data ? (
        <Skeleton className={"h-12 w-full max-w-[35rem]"} />
      ) : (
        <h4 className="text-48-medium text-typography-primary">
          {t("home.hello")}{" "}
          <span className="capitalize">{name?.toLocaleLowerCase()}</span>!
        </h4>
      )}

      <p className="text-14-medium text-typography-secondary">
        {t("dates.today")} {formattedDate}
      </p>
    </section>
  );
}
