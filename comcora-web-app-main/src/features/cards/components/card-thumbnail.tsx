import React from "react";

import { Icon } from "@/components/ui/icon";

export default function CardThumbnail({
  lastFour,
  onClick,
}: {
  lastFour: string;
  onClick?: (event: React.MouseEvent) => void;
}) {
  return (
    <div
      className="cursor-pinter flex h-8 w-[3.125rem] flex-col justify-between rounded bg-brand-mastercard p-1 pt-0.5"
      onClick={onClick}
    >
      <span className="text-10-medium text-typography-surface">
        {lastFour.substring(lastFour.length - 4, lastFour.length)}
      </span>
      <div className={"flex w-full justify-end"}>
        <Icon name={"MC"} className="h-1.5 w-2.5" />
      </div>
    </div>
  );
}
