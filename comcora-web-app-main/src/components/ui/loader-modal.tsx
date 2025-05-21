import { type PropsWithChildren } from "react";

import { Icon } from "@/components/ui/icon";

export interface LoaderModalProps {
  visible?: boolean;
}

export function LoaderModal(props: PropsWithChildren<LoaderModalProps>) {
  const { visible } = props;
  if (!visible) {
    return null;
  }
  return (
    <div className="fixed inset-0 flex size-full items-center justify-center bg-black/80">
      <div className={"flex flex-1 items-center justify-center"}>
        <Icon className={"size-10 animate-spin"} name={"40/Accent/Preloader"} />
      </div>
    </div>
  );
}
