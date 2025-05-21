"use client";

import { useMemo, useState, type ReactElement } from "react";
import { type TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { ListOption } from "@/components/ui/list-option";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Thumbnail } from "@/components/ui/thumbnail";

type StatusType = "active" | "completed";

export type AgreementType = {
  name: string;
  invoiceName: string;
  status: StatusType;
  date: string;
  time: string;
  id?: number;
  thumbnail?: ReactElement;
};

const getStatuses = (t: TFunction<string, undefined>) => ({
  active: {
    name: t("einvoices.active"),
    icon: (
      <Icon name="16/Primary/Time" className="size-4 text-typography-success" />
    ),
  },
  completed: {
    name: t("einvoices.ended"),
    icon: (
      <Icon
        name="16/Primary/Warning"
        className="size-4 text-typography-critical"
      />
    ),
  },
});

export default function AgreementOption(props: AgreementType) {
  const { t } = useTranslation();
  const statuses = useMemo(() => getStatuses(t), [t]);
  const { name, invoiceName, status, date, time, thumbnail } = props;
  const [open, setOpen] = useState(false);

  return (
    <ListOption onClick={() => setOpen(true)}>
      <Thumbnail variant={"light"}>{thumbnail}</Thumbnail>
      <div className="flex grow flex-col gap-y-2">
        <div className="flex flex-col">
          <span className="grow text-16-semibold text-typography-primary">
            {name}
          </span>
          <div className="flex items-center gap-x-1">
            <span className="text-12-medium text-typography-primary">
              {`${t("einvoices.title")} ${invoiceName}`}
            </span>
            <Icon
              name={"16/Primary/Interpunct"}
              className="size-4 text-typography-secondary"
            />
            <SectionTitle>
              {date} {time}
            </SectionTitle>
          </div>
        </div>
        <div
          className={cn(
            "flex w-fit items-center gap-x-1 rounded-lg border py-1 pl-1 pr-2 text-12-medium",
            status === "active"
              ? "border-fill-primary-success text-typography-success"
              : "border-fill-primary-critical text-typography-critical"
          )}
        >
          {statuses[status].icon}
          <span>{statuses[status].name}</span>
        </div>
      </div>
    </ListOption>
  );
}
