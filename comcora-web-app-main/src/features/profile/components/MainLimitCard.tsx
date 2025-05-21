import { type FC } from "react";
import Dollar from "public/dollar.png";
import { useTranslation } from "react-i18next";

import { type LimitCard } from "./TariffLimitsTab";

type MianLimitCardProps = {
  limitCard: LimitCard;
};

export const MianLimitCard: FC<MianLimitCardProps> = ({ limitCard }) => {
  const { t } = useTranslation();
  return (
    <div className="relative col-span-2 flex h-full cursor-pointer justify-between rounded-2xl bg-fill-accent">
      <div className="absolute right-0 top-[-10px] z-50 rotate-[4deg] rounded-xl bg-fill-surface px-4 py-2 shadow-m">
        <div className="text-center text-12-medium text-typography-secondary">
          {t("profile.personalDetails.limitWillBeUpdated")}
        </div>
        <div className="text-center text-12-medium text-typography-secondary">{`4 ${t("dates.month.long.7")} 2025`}</div>
      </div>
      <div className="flex-1 p-4 text-16-medium">
        {limitCard.title}
        {limitCard.value}
        <div className="mt-2 h-[8px] w-[96px] rounded-xl bg-fill-accent-active">
          <div className="h-full w-[16px] rounded-xl bg-fill-primary"></div>
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden rounded-2xl">
        <img
          className="absolute rotate-[-15deg] scale-200"
          src={Dollar.src}
          alt=""
        />
      </div>
    </div>
  );
};
