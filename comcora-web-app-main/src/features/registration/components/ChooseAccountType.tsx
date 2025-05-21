"use client";

import { useRouter } from "next/navigation";
import { currency } from "@/features/limits/helpers/constants";
import { AppDownload } from "@/features/login/components/AppDownload";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { CURRENCY_SIGNS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

// interface ChooseAccountTypeProps {
//   nextStep: () => void;
// }

const formSchema = z.object({
  address: z.string().min(1),
  apartment: z.string().min(1),
});

export function ChooseAccountType() {
  const { t } = useTranslation();
  const router = useRouter();
  const redirectToLogin = () => {
    router.push("/");
  };

  return (
    <div className={"flex h-full flex-col justify-between"}>
      <div className={"flex flex-1 items-center justify-center"}>
        <div className={"flex flex-col items-center gap-10"}>
          <h2 className="text-center text-32-medium text-typography-primary">
            {t("auth.registration.chooseYourAccountType")}
          </h2>
          <div className="flex gap-4">
            <div className="flex flex-col justify-between rounded-2xl bg-fill-primary p-4">
              <div className="flex flex-col gap-8">
                <div className="flex w-full min-w-[368px] items-center justify-between">
                  <p className="text-24-medium">
                    {t("auth.registration.premium")}
                  </p>
                  <p className="text-24-medium">
                    25 {CURRENCY_SIGNS[currency]}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="rounded-xl bg-fill-primary-light p-1">
                    <Icon name="24/Primary/More" />
                  </div>
                  <div>
                    <p className="mb-1 text-16-medium">
                      {t("auth.registration.comissionlessTransactions")}
                    </p>
                    <p className="text-12-medium text-typography-secondary">
                      {t("auth.registration.comissionlessTransactionsDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="rounded-xl bg-fill-primary-light p-1">
                    <Icon name="24/Primary/More" />
                  </div>
                  <div>
                    <p className="mb-1 text-16-medium">
                      {t("auth.registration.higherLimits")}
                    </p>
                    <p className="text-12-medium text-typography-secondary">
                      {t("auth.registration.higherLimitsDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="rounded-xl bg-fill-primary-light p-1">
                    <Icon name="24/Primary/More" />
                  </div>
                  <div>
                    <p className="mb-1 text-16-medium">
                      {t("auth.registration.exclusiveOffers")}
                    </p>
                    <p className="text-12-medium text-typography-secondary">
                      {t("auth.registration.exclusiveOffersDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="rounded-xl bg-fill-primary-light p-1">
                    <Icon name="24/Primary/More" />
                  </div>
                  <div>
                    <p className="mb-1 text-16-medium">
                      {t("auth.registration.personalManager")}
                    </p>
                    <p className="text-12-medium text-typography-secondary">
                      {t("auth.registration.personalManagerDesc")}
                    </p>
                  </div>
                </div>
              </div>
              <Button size={"L"} variant="dark" onClick={redirectToLogin}>
                {t("auth.registration.connectPremiumAccount")}
              </Button>
            </div>
            <div className="flex flex-col gap-8 rounded-2xl bg-fill-primary p-4">
              <div className="flex w-full min-w-[368px] items-center justify-between">
                <p className="text-24-medium text-typography-secondary">
                  {t("auth.registration.standard")}
                </p>
                <p className="text-24-medium text-typography-secondary">
                  0 {CURRENCY_SIGNS[currency]}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="rounded-xl bg-fill-primary-light p-1">
                  <Icon name="24/Primary/More" />
                </div>
                <div>
                  <p className="mb-1 text-16-medium">
                    {t("auth.registration.transactionWithComission")}
                  </p>
                  <p className="text-12-medium text-typography-secondary">
                    {t("auth.registration.transactionWithComissionDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="rounded-xl bg-fill-primary-light p-1">
                  <Icon name="24/Primary/More" />
                </div>
                <div>
                  <p className="mb-1 text-16-medium">
                    {t("auth.registration.lowLimits")}
                  </p>
                  <p className="text-12-medium text-typography-secondary">
                    {t("auth.registration.lowLimitsDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="rounded-xl bg-fill-primary-light p-1">
                  <Icon name="24/Primary/More" />
                </div>
                <div>
                  <p className="mb-1 text-16-medium">
                    {t("auth.registration.limitedOffer")}
                  </p>
                  <p className="text-12-medium text-typography-secondary">
                    {t("auth.registration.limitedOfferDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="rounded-xl bg-fill-primary-light p-1">
                  <Icon name="24/Primary/More" />
                </div>
                <div>
                  <p className="mb-1 text-16-medium">
                    {t("auth.registration.noPersonaManager")}
                  </p>
                  <p className="text-12-medium text-typography-secondary">
                    {t("auth.registration.noPersonaManagerDesc")}
                  </p>
                </div>
              </div>
              <Button size={"L"} variant="accent" onClick={redirectToLogin}>
                {t("auth.registration.setLater")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AppDownload />
    </div>
  );
}
