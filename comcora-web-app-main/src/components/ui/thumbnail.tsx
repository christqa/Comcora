import { type PropsWithChildren } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

interface ThumbnailProps extends VariantProps<typeof thumbnailVariants> {
  className?: string;
}

const thumbnailVariants = cva(
  "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl text-center text-16-medium",
  {
    variants: {
      variant: {
        accent: "bg-fill-accent",
        primary: "bg-fill-primary",
        light: "bg-fill-primary-light",
        transparent: "bg-transparent",
        "secondary-success": "bg-fill-secondary-success",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export const Thumbnail = ({
  variant,
  children,
  className,
}: PropsWithChildren<ThumbnailProps>) => {
  return (
    <div className={cn(thumbnailVariants({ variant, className }))}>
      {children}
    </div>
  );
};
