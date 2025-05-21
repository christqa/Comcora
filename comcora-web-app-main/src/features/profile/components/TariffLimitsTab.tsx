import { useState } from "react";
import { type IconName } from "@/types/name";
import { type TFunction } from "i18next";
import CashOut from "public/cashout.png";
import Deals from "public/deals.png";
import Dollar from "public/dollar.png";
import Exchange from "public/exchange.png";
import { useTranslation } from "react-i18next";

import { LimitCard } from "./LimitCard";
import { LimitCardDialog } from "./LimitCardModal";
import { MianLimitCard } from "./MainLimitCard";

export type LimitCard = {
  title: string;
  icon: IconName | "";
  value: JSX.Element;
  description: string;
  image: JSX.Element;
  isMain?: boolean;
  rotate?: boolean;
};

const limitCards = (t: TFunction): LimitCard[] => [
  {
    title: t("profile.personalDetails.dayLimitRemaining"),
    icon: "",
    value: <div className="text-48-medium">2400 €</div>,
    description: t("profile.personalDetails.noCommissionDayLimitDescription"),
    image: <img src={Dollar.src} alt="Dollar" className="size-[205px]" />,
    isMain: true,
    rotate: true,
  },
  {
    title: t("profile.personalDetails.noCommissionCashOut"),
    icon: "24/Primary/WadOfMoney",
    value: <div className="text-48-medium">25 €</div>,
    description: t("profile.personalDetails.noCommissionCashOutDescription"),
    image: <img src={CashOut.src} alt="Dollar" className="size-[205px]" />,
    rotate: false,
  },
  {
    title: t("profile.personalDetails.noCommissionExchange"),
    icon: "24/Primary/Convertation",
    value: <div className="text-48-medium">983,76 €</div>,
    description: t("profile.personalDetails.noCommissionExchangeDescription"),
    image: <img src={Exchange.src} alt="Dollar" className="size-[205px]" />,
    rotate: true,
  },
  {
    title: t("profile.personalDetails.noCommissionDeals"),
    icon: "24/Primary/Users",
    value: (
      <div className="text-48-medium">
        2 <span className="text-typography-secondary">из 4</span>
      </div>
    ),
    description: t("profile.personalDetails.noCommissionDealsDescription"),
    image: <img src={Deals.src} alt="Dollar" className="size-[205px]" />,
    rotate: false,
  },
];

export const TariffLimitsTab = () => {
  const { t } = useTranslation();
  const [activeCard, setActiveCard] = useState<LimitCard | null>(null);

  return (
    <div className="grid h-full grid-cols-3 gap-4">
      {limitCards(t).map((el, index) =>
        el.isMain ? (
          <div
            key={el.title + index}
            className="col-span-2 h-full"
            onClick={() => setActiveCard(el)}
          >
            <MianLimitCard limitCard={el} />
          </div>
        ) : (
          <div key={el.title + index} onClick={() => setActiveCard(el)}>
            <LimitCard
              title={el.title}
              icon={el.icon as IconName}
              value={el.value}
            />
          </div>
        )
      )}
      {activeCard && (
        <LimitCardDialog
          rotate={activeCard.rotate}
          open={!!activeCard}
          limitCard={activeCard}
          onClose={() => setActiveCard(null)}
        />
      )}
    </div>
  );
};
