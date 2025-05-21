import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/icon";

const buttonVariants = cva(
  "group rounded-full ring-offset-background transition-opacity",

  {
    variants: {
      size: {
        small: "size-6",
        default: "size-10",
        large: "size-12",
      },
      noBackground: {
        true: "disabled:hidden",
        false:
          "bg-fill-surface-inverse hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:bg-fill-disabled",
      },
    },
    defaultVariants: {
      noBackground: false,
      size: "default",
    },
  }
);

const iconVariants = cva(" group-disabled:text-icon-disabled", {
  variants: {
    size: {
      small: "size-4",
      default: "size-6",
      large: "size-10",
    },
    noBackground: {
      true: "text-typography-primary-inverse ",
      false: "text-white group-hover:text-fill-surface-inverse",
    },
  },
  defaultVariants: {
    size: "default",
    noBackground: false,
  },
});

export type IconButtonProps = {
  iconName: IconName;
  noBackground?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> &
  VariantProps<typeof iconVariants>;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, size, iconName, noBackground, ...rest }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ noBackground }), className)}
        ref={ref}
        {...rest}
      >
        <Icon
          className={cn(iconVariants({ size, noBackground }))}
          name={iconName}
        />
        {children}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

export { IconButton, buttonVariants, iconVariants };
