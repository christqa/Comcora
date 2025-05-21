import { type PropsWithChildren } from "react";

import { Icon } from "@/components/ui/icon";

export function InfoMessage(props: PropsWithChildren) {
  const { children } = props;
  return (
    <div className="flex items-start gap-x-2 rounded-2xl bg-fill-secondary-caution p-4">
      <div className={"flex size-4 shrink-0"}>
        <Icon
          name={"16/Primary/Info"}
          className={"size-4 text-typography-caution"}
        />
      </div>

      <p className="grow text-12-medium text-typography-caution">{children}</p>
    </div>
  );
}
