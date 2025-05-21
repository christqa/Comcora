import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "disabled:fill-disabled inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:text-typography-disabled",
  {
    variants: {
      variant: {
        accent:
          "bg-fill-accent text-typography-surface-inverse hover:bg-fill-accent/90 disabled:bg-fill-disabled",
        primary:
          "bg-fill-primary text-typography-primary hover:bg-fill-primary-active/90 disabled:bg-fill-disabled",
        "primary-inverse":
          "bg-fill-primary-inverse text-typography-primary-inverse hover:bg-fill-primary-inverse/90 disabled:bg-fill-disabled",
        "secondary-critical":
          "bg-fill-secondary text-typography-critical hover:bg-fill-secondary/90 disabled:bg-fill-disabled",
        "secondary-success":
          "bg-fill-secondary text-typography-success hover:bg-fill-secondary/90 disabled:bg-fill-disabled",
        transparent: "bg-transparent text-typography-primary",

        // SHAD
        default:
          "bg-fill-accent hover:bg-fill-accent/90 disabled:bg-fill-disabled disabled:text-typography-disabled",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        dark: "bg-color-dark text-white hover:bg-color-dark/90 disabled:bg-fill-disabled",
      },
      size: {
        L: "h-14 gap-x-2 rounded-2xl px-10 py-4 text-16-medium",
        M: "h-10 gap-x-2 rounded-xl px-6 py-3 text-14-medium",
        S: "h-8 gap-x-1 rounded-lg px-3 py-2 text-12-medium",
        // SHAD
        default: "h-14 p-4",
        sm: "h-9 rounded-2xl px-3",
        lg: "h-11 rounded-2xl px-8",
        icon: "size-8 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "accent",
      size: "M",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
// TODO: Refactor button aria-label
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      "aria-label": ariaLabel = " ",
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        aria-label={ariaLabel}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
