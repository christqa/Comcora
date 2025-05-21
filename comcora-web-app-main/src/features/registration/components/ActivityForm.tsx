"use client";

import { useState } from "react";
import { AppDownload } from "@/features/login/components/AppDownload";
import { type TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { resolveListItemVariant } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { ListOption } from "@/components/ui/list-option";
import { Thumbnail } from "@/components/ui/thumbnail";

const generateActivityAreaOptions = (t: TFunction) => {
  return [
    {
      name: `${t("auth.registration.activity.studying")}`,
      icon: "📖",
      value: "studying",
      key: 1,
    },
    {
      name: `${t("auth.registration.activity.working")}`,
      icon: "🕓",
      value: "working",
      key: 2,
    },
    {
      name: `${t("auth.registration.activity.entrepreneur")}`,
      icon: "💼",
      value: "entrepreneur",
      key: 3,
    },
    {
      name: `${t("auth.registration.activity.notWorking")}`,
      icon: "🏠",
      value: "notWorking",
      key: 4,
    },
  ];
};

const generateIncomeOptions = (t: TFunction) => {
  return [
    {
      name: `${t("auth.registration.activity.until")} 3 000`,
      value: "upTo3000",
      key: 0,
    },
    { name: "3 000 - 10 000", value: "from3000to10000", key: 1 },
    {
      name: `${t("auth.registration.activity.moreThan")} 10 000`,
      value: "moreThan10000",
      key: 2,
    },
  ];
};

interface ActivityFormProps {
  nextStep: () => void;
}

export function ActivityForm({ nextStep }: ActivityFormProps) {
  const { t } = useTranslation();
  const [nextStepReady, setNextStepReady] = useState(false);
  const activityOptions = generateActivityAreaOptions(t);
  const incomeOptions = generateIncomeOptions(t);

  return (
    <div className={"flex h-full flex-col justify-between"}>
      <div className="flex flex-1 flex-col items-center justify-center">
        {!nextStepReady ? (
          <div className={"flex flex-col items-center gap-10"}>
            <h2 className="text-center text-32-medium text-typography-primary">
              {t("auth.registration.activity.activityArea")}
            </h2>
            <div className="min-w-[375px] rounded-3xl bg-fill-primary">
              {activityOptions.map(({ value, name, icon }, index) => (
                <ListOption
                  key={value}
                  containerClassName="rounded-3xl"
                  listItemVariant={resolveListItemVariant(
                    index,
                    activityOptions.length
                  )}
                  onClick={() => setNextStepReady(true)}
                >
                  <Thumbnail variant="light">
                    <span className="text-[16px]">{icon}</span>
                  </Thumbnail>
                  <p className="mt-2 grow text-16-semibold">{name}</p>
                </ListOption>
              ))}
            </div>
          </div>
        ) : (
          <div className={"flex flex-col items-center gap-10"}>
            <h2 className="text-center text-32-medium text-typography-primary">
              {t("auth.registration.activity.monthlyIncome")}
            </h2>
            <div className="min-w-[375px] rounded-3xl bg-fill-primary">
              {incomeOptions.map(({ value, name }, index) => (
                <ListOption
                  key={value}
                  containerClassName="rounded-3xl"
                  listItemVariant={resolveListItemVariant(
                    index,
                    incomeOptions.length
                  )}
                  onClick={nextStep}
                >
                  <Thumbnail variant="light">
                    <Icon name={"24/Colored/Euro"} />
                  </Thumbnail>
                  <p className="mt-2 grow text-16-semibold">{name}</p>
                </ListOption>
              ))}
            </div>
          </div>
        )}
      </div>

      <AppDownload />
    </div>
  );
}
