"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("flex w-full flex-col", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  radioIconType?: string;
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(
  (
    { className, checked, radioIconType, "aria-label": ariaLabel, ...props },
    ref
  ) => {
    // @TODO: refactor this to use the new icon component
    return (
      <RadioGroupPrimitive.Item
        ref={ref}
        aria-label={ariaLabel ?? " "}
        className={cn(
          "relative flex aspect-square size-8 items-center justify-center text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <Icon
          name={
            radioIconType === "rounded"
              ? "24/Primary/Circle"
              : "24/Primary/Rectangle"
          }
          className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 fill-current text-typography-secondary"
        />

        <RadioGroupPrimitive.Indicator>
          <Icon
            name={
              radioIconType === "rounded"
                ? "24/Primary/RadioCheck"
                : "24/Primary/CheckBox"
            }
            className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 fill-current text-icon-success"
          />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
    );
  }
);
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
