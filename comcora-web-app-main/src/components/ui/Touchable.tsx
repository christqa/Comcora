import * as React from "react";
import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const touchableVariants = cva(
  "inline-flex items-center justify-center focus-visible:outline-none",
  {
    variants: {
      effect: {
        opacity: "transition-opacity active:opacity-50",
      },
    },
    defaultVariants: {
      effect: "opacity",
    },
  }
);

export interface TouchableProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof touchableVariants> {
  asChild?: boolean;
}

const Touchable = forwardRef<HTMLButtonElement, TouchableProps>(
  ({ className, effect = "opacity", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(touchableVariants({ effect }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Touchable.displayName = "Button";

export { Touchable, touchableVariants };
