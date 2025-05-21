"use client";

import { useState, type PropsWithChildren } from "react";

import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Icon } from "@/components/ui/icon";

export const CollapsibleSection = (
  props: PropsWithChildren<{ title: string; titleClassname?: string }>
) => {
  const { title, titleClassname, children } = props;
  const [open, setOpen] = useState(true);
  return (
    <Collapsible
      defaultOpen={true}
      disabled={false}
      open={open}
      onOpenChange={(v) => setOpen(v)}
    >
      <div>
        <CollapsibleTrigger className={"flex w-full text-left"}>
          <div className="flex w-full justify-between gap-x-1 px-4 pb-2 pt-4">
            <span
              className={cn(
                "grow text-12-medium text-typography-secondary",
                titleClassname
              )}
            >
              {title}
            </span>
            <Icon
              name={"16/Primary/ArrowDown"}
              className={cn(
                "h-4 w-4 text-icon-secondary",
                !open && "-rotate-90"
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {" "}
          <div>{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
