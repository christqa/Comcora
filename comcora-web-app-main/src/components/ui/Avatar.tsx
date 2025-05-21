import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";

import { buildNameAcronym, cn } from "@/lib/utils";

const avatarVariants = cva("relative flex shrink-0", {
  variants: {
    size: {
      S: "size-8 rounded-xl",
      M: "size-10 rounded-2xl",
      L: "size-18 rounded-3xl",
      XL: "size-20 rounded-3xl border border-stroke-primary",
      XXL: "size-24 rounded-4xl border border-stroke-primary",
    },
  },
  defaultVariants: {
    size: "M",
  },
});

const statusVariants = cva("absolute border-2", {
  variants: {
    size: {
      S: "-bottom-0.5 -right-0.5 size-[10px] ",
      M: "-bottom-0 -right-0 size-[13px]",
    },
  },
  defaultVariants: {
    size: "M",
  },
});

interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  showBadge?: boolean;
  fallBackClassName?: string;
  textClassName?: string;
  statusSize?: VariantProps<typeof statusVariants>["size"];
}

export function Avatar({
  className,
  fallBackClassName,
  textClassName,
  size = "M",
  src,
  alt,
  showBadge,
  statusSize = "M",
  ...props
}: AvatarProps) {
  const altAbbr = buildNameAcronym(alt);

  return (
    <AvatarPrimitive.Root className={cn(avatarVariants({ size }))} {...props}>
      <AvatarPrimitive.Image
        className={cn(avatarVariants({ size }), "object-cover")}
        src={src}
        alt={alt ?? "Avatar"}
      />
      <AvatarPrimitive.Fallback
        className={cn(
          avatarVariants({ size }),
          "flex items-center justify-center bg-muted",
          fallBackClassName,
          className
        )}
      >
        <span
          className={cn(
            "text-16-medium text-typography-primary",
            textClassName
          )}
        >
          {altAbbr ?? ""}
        </span>
      </AvatarPrimitive.Fallback>
      {showBadge && (
        <div
          className={cn(
            "absolute rounded-full border-white bg-fill-accent",
            statusVariants({ size: statusSize })
          )}
        />
      )}
    </AvatarPrimitive.Root>
  );
}
