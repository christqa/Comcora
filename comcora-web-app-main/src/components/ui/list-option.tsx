import { type PropsWithChildren } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const listOptionVariants = cva("w-full bg-fill-primary p-2", {
  variants: {
    listItemVariant: {
      default: `rounded-2xl`,
      "split-up": `rounded-t-3xl`,
      "split-half": `rounded-none`,
      "split-down": `rounded-b-2xl`,
    },
  },
  defaultVariants: {
    listItemVariant: "default",
  },
});

export const ListOption = ({
  listItemVariant,
  children,
  onClick,
  containerClassName,
  className,
}: PropsWithChildren<
  VariantProps<typeof listOptionVariants> & {
    onClick?: (event: React.MouseEvent) => void;
    className?: string;
    containerClassName?: string;
  }
>) => {
  return (
    <div
      className={cn(
        listOptionVariants({ listItemVariant }),
        containerClassName
      )}
    >
      <div
        className={cn(
          "flex grow items-start gap-x-4 rounded-[1.25rem] px-2",
          Boolean(onClick) && "cursor-pointer hover:bg-fill-primary-light",
          className
        )}
        onClick={onClick}
      >
        {children}
      </div>
    </div>
  );
};
