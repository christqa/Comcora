import React, { type PropsWithChildren } from "react";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

type CardPlaceholderProps = {
  className?: string;
};

export function CardPlaceholder(
  props: PropsWithChildren<CardPlaceholderProps>
) {
  const { className } = props;
  return (
    <div
      className={cn(
        "flex h-52 w-80 flex-shrink-0 flex-col items-center justify-center gap-y-10 rounded-2xl bg-fill-secondary-active",
        className
      )}
    >
      <Icon name="24/Primary/Plus" />
    </div>
  );
}
