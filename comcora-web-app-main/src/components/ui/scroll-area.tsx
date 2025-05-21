"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

type ScrollAreaProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Root
> & {
  maxHeight?: string;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
};

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, children, maxHeight, onScroll, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative h-full overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      className={"size-full overflow-auto rounded-[inherit]"}
      style={{ maxHeight: maxHeight ?? "100%" }}
      onScroll={onScroll}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar maxHeight={maxHeight} />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

type ScrollBarProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
> & {
  maxHeight?: string;
};

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, orientation = "vertical", maxHeight, ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "w-2 border-l border-l-transparent p-[2px]",
      orientation === "horizontal" &&
        " flex-col border-t border-t-transparent p-[2px]",
      className
    )}
    style={{ maxHeight: maxHeight ?? "100%" }}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-fill-accent" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
