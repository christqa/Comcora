import Link from "next/link";
import { type LocationInfo } from "@/features/contact/types/contacts.types";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function LocationIndicator({
  handleCloseInfoWindow,
  locationInfo,
}: {
  handleCloseInfoWindow: () => void;
  locationInfo: LocationInfo;
}) {
  const { t } = useTranslation();

  return (
    <div className={"flex w-full flex-col gap-y-4"}>
      <div className="flex justify-between">
        <p className={"text-14-medium text-typography-primary"}>
          {locationInfo.title}
        </p>
        <Button
          variant={"transparent"}
          className={"size-fit p-0 text-typography-primary"}
          onClick={handleCloseInfoWindow}
        >
          <Icon name="16/Primary/Cross" className="size-4" />
        </Button>
      </div>
      <div className={"text-14-medium text-typography-secondary"}>
        <p>{locationInfo.location}</p>
        <p>
          {locationInfo.startWeekDay}-{locationInfo.endWeekDay}
          {locationInfo.startHour}-{locationInfo.endHour}
        </p>
      </div>
      <div className="flex justify-between">
        <div className={"flex flex-col"}>
          <Link
            href={`tel:${locationInfo.telephone}`}
            className={"text-12-medium text-typography-primary"}
          >
            {locationInfo.telephone}
          </Link>
          <Link
            href={`https://www.${locationInfo.website}`}
            className={"text-12-medium text-typography-success"}
          >
            {locationInfo.website}
          </Link>
        </div>
        <Button size={"S"} variant={"primary-inverse"} className={"w-24"}>
          {t("contacts.route")}
        </Button>
      </div>
    </div>
  );
}
