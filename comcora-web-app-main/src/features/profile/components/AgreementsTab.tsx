"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ListOption } from "@/components/ui/list-option";
import { ListOptionContent } from "@/components/ui/list-option-content";
import { Thumbnail } from "@/components/ui/thumbnail";

export const AgreementsTab = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col rounded-2xl bg-fill-primary pb-4">
      <ListOption>
        <Thumbnail variant={"light"}>
          <Icon name={"24/Primary/Documents"} className={"size-6"} />
        </Thumbnail>
        <ListOptionContent title={t("profile.agreements.accountStatement")}>
          <span className={"text-12-medium text-typography-primary"}>
            {t("profile.agreements.confirmsTransactionsPeriod")}
          </span>
        </ListOptionContent>
        <span className={"pr-3 text-12-medium  text-typography-secondary"}>
          12 {t("dates.month.long.9")}
        </span>
      </ListOption>
      <ListOption>
        <Thumbnail variant={"light"}>
          <Icon name={"24/Primary/Documents"} className={"size-6"} />
        </Thumbnail>
        <ListOptionContent title={t("profile.agreements.accountStatement")}>
          <span className={"text-12-medium text-typography-primary"}>
            {t("profile.agreements.confirmsTransactionsPeriod")}
          </span>
        </ListOptionContent>
        <span className={"pr-3 text-12-medium text-typography-secondary"}>
          12 {t("dates.month.long.9")}
        </span>
      </ListOption>
      <ListOption>
        <Thumbnail variant={"light"}>
          <Icon name={"24/Primary/Documents"} className={"size-6"} />
        </Thumbnail>
        <ListOptionContent
          title={t("profile.agreements.availableBalanceStatement")}
        >
          <span className={"text-12-medium text-typography-primary"}>
            {t("profile.agreements.currentAccountBalance")}
          </span>
        </ListOptionContent>
        <span className={"pr-3 text-12-medium text-typography-secondary"}>
          13 {t("dates.month.long.9")}
        </span>
      </ListOption>

      <div className={"mt-4 w-full px-4"}>
        <Button variant={"secondary-success"} className={"w-full"}>
          {t("common.buttonText.showMore")}
        </Button>
      </div>
    </div>
  );
};
