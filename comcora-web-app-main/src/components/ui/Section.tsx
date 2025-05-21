import { type PropsWithChildren } from "react";
import cn from "classnames";

import { SectionTitle } from "@/components/ui/SectionTitle";

export const Section = (
  props: PropsWithChildren<{ title: string; className?: string }>
) => {
  const { title, children, className } = props;
  return (
    <section>
      <div className={cn("px-4 pb-2 pt-4", className)}>
        <SectionTitle>{title}</SectionTitle>
      </div>
      <div>{children}</div>
    </section>
  );
};
