import { type PropsWithChildren } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { RadioGroupItem } from "@/components/ui/radio-group";

const radioOptionVariants = cva(
  "flex grow items-center gap-x-4 bg-fill-primary p-4",
  {
    variants: {
      listItemVariant: {
        default: `rounded-2xl`,
        "split-up": `rounded-t-2xl`,
        "split-half": `rounded-none`,
        "split-down": `rounded-b-2xl`,
      },
    },
    defaultVariants: {
      listItemVariant: "default",
    },
  }
);

export const RadioOption = ({
  listItemVariant,
  children,
  id,
  value,
  className,
  radioIconType,
  ariaLabel,
}: PropsWithChildren<
  VariantProps<typeof radioOptionVariants> & {
    id: string;
    value: string;
    className?: string;
    radioIconType?: string;
    ariaLabel?: string;
  }
>) => {
  return (
    <label
      htmlFor={id}
      className={cn(radioOptionVariants({ listItemVariant }), className)}
    >
      {children}
      <RadioGroupItem
        value={value}
        id={id}
        radioIconType={radioIconType}
        aria-label={ariaLabel}
      />
    </label>
  );
};
