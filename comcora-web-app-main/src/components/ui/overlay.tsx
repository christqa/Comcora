import { type PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export interface OverlayProps {
  visible?: boolean;
}

export function Overlay(props: PropsWithChildren<OverlayProps>) {
  const { children, visible } = props;
  return (
    <div
      className={cn(
        "absolute inset-0 z-20 flex items-center justify-center",
        !visible && "hidden"
      )}
    >
      {children}
    </div>
  );
}
