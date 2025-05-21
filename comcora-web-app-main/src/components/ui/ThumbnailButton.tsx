import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { Icon } from "./icon";

const buttonVariants = cva(
  "group flex flex-col items-center gap-2 rounded-3xl transition-opacity  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:text-typography-disabled",
  {
    variants: {
      size: {
        default: "w-18 gap-2",
        large: "w-24 gap-2",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const thumbnailVariants = cva("", {
  variants: {
    size: {
      default: "size-18",
      large: "size-24",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const titleVariants = cva("line-clamp-2 text-typography-primary", {
  variants: {
    size: {
      default: "text-12-medium",
      large: "text-12-medium",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const subtitleVariants = cva("text-typography-secondary", {
  variants: {
    size: {
      default: "text-10-medium",
      large: "text-10-medium",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface ThumbnailButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
}

const ThumbnailButton = forwardRef<HTMLButtonElement, ThumbnailButtonProps>(
  (
    { className, children, size, title, subtitle, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ size }), className)}
        type="button"
        {...props}
      >
        <div className={thumbnailVariants({ size })}>
          {children ?? (
            <div className="flex size-full items-center justify-center rounded-3xl border border-dashed border-stroke-secondary text-icon-secondary">
              <Icon name="24/Primary/Plus" />
            </div>
          )}
        </div>
        {(title ?? subtitle) && (
          <div className="flex flex-col items-center gap-0.5">
            {title && <span className={titleVariants({ size })}>{title}</span>}
            {subtitle && (
              <span className={subtitleVariants({ size })}>{subtitle}</span>
            )}
          </div>
        )}
      </Comp>
    );
  }
);
ThumbnailButton.displayName = "ThumbnailButton";

export { ThumbnailButton };
