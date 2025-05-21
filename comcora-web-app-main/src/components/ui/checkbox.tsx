"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    rounded?: boolean;
  }
>(({ className, ...props }, ref) => {
  const { checked, rounded } = props;

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn("relative size-4", className)}
      {...props}
    >
      {checked ? (
        <CheckboxPrimitive.Indicator
          className={cn("flex items-center justify-center text-current")}
        >
          <Icon
            name={rounded ? "16/Success/Check" : "16/Primary/RectangleCheck"}
            className={`size-4 text-icon-success ${rounded ? "size-[21px]" : ""}`}
          />
        </CheckboxPrimitive.Indicator>
      ) : (
        <Icon
          name={rounded ? "16/Primary/Circle" : "16/Primary/Rectangle"}
          className={`absolute right-0 top-0 size-4 text-icon-secondary ${rounded ? "size-[21px]" : ""}`}
        />
      )}
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
