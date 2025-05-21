import { type PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export const SectionTitle = (
  props: PropsWithChildren<{ className?: string }>
) => {
  const { children, className } = props;
  return (
    <span className={cn("text-12-medium text-typography-secondary", className)}>
      {children}
    </span>
  );
};
