import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/icon";

const buttonVariants = cva(
  "group rounded-full bg-fill-surface-inverse ring-offset-background transition-opacity hover:bg-fill-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:border-2 active:border-stroke-secondary-active disabled:bg-fill-disabled",
  {
    variants: {
      size: {
        default: "size-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const iconVariants = cva(
  "text-icon-surface group-hover:text-icon-surface-inverse group-disabled:text-icon-disabled",
  {
    variants: {
      size: {
        default: "size-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export type ButtonProps = {
  iconName: IconName;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const TransparentButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { className, children, size, iconName, ...rest } = props;

    return (
      <button
        className={cn(buttonVariants({ size, className }))}
        ref={ref}
        {...rest}
      >
        <Icon name={iconName} className={cn(iconVariants({ size }))} />
        {children}
      </button>
    );
  }
);
TransparentButton.displayName = "TransparentButton";

export { TransparentButton, buttonVariants };
