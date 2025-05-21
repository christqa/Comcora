import {
  type LocationInfo,
  type Position,
} from "@/features/contact/types/contacts.types";
import useAddresses from "@/features/contact/utils/useAddresses";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Thumbnail } from "@/components/ui/thumbnail";

export default function Addresses({
  onPositionChanged,
  selectedId,
}: {
  onPositionChanged: (marker: Position, id: number, info: LocationInfo) => void;
  selectedId: number;
}) {
  const { t } = useTranslation();
  const { addresses } = useAddresses();

  // @TODO: Refactor rounded-[20px] to rounded-2xl - 1rem
  return (
    <div className="flex w-[376px] flex-col gap-4 rounded-3xl bg-fill-primary p-2">
      {addresses.map((item) => (
        <button
          key={item.id}
          className={cn(
            "flex gap-4 rounded-[20px] p-2 text-left",
            selectedId === item.id && "bg-fill-primary-light"
          )}
          onClick={() => onPositionChanged(item.position, item.id, item)}
          aria-label={item.title}
        >
          <Thumbnail variant={selectedId === item.id ? "primary" : "light"}>
            <Icon
              name={"24/Primary/Pin"}
              className="size-6 text-typography-primary"
            />
          </Thumbnail>
          <div className="flex flex-1 flex-col pr-2">
            <div className="flex items-center justify-between">
              <span className={"text-16-semibold text-typography-primary"}>
                {item.title}
              </span>
              <SectionTitle className="text-right">
                {item.distance}
                {item.unit}
              </SectionTitle>
            </div>
            <p className={"mb-2 text-12-medium text-typography-primary"}>
              {item.location}
            </p>
            <p className={"text-12-medium text-typography-secondary"}>
              {t("contacts.openUntil")} {item.timeClosed}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
