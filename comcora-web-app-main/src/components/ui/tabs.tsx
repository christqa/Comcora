"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const TabsVariantContext =
  React.createContext<VariantProps<typeof tabsTriggerVariants>["variant"]>(
    "underline"
  );

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
    variant?: VariantProps<typeof tabsTriggerVariants>["variant"];
  }
>(({ variant = "underline", ...props }, ref) => (
  <TabsVariantContext.Provider value={variant}>
    <TabsPrimitive.Root ref={ref} {...props} />
  </TabsVariantContext.Provider>
));
Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const variant = React.useContext(TabsVariantContext);

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "flex text-typography-secondary",
        variant === "chip" && "gap-2",
        className
      )}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        underline: [
          "px-4 pb-4 text-14-medium ring-offset-background",
          "border-b-2 border-stroke-secondary",
          "data-[state=active]:border-stroke-accent",
          "data-[state=active]:text-typography-primary",
        ],
        chip: [
          "rounded-lg bg-transparent px-4 py-3 text-14-medium text-typography-primary hover:bg-fill-primary-active",
          "data-[state=active]:bg-fill-primary",
          "data-[state=active]:text-typography-primary",
        ],
      },
      fullWidth: {
        true: "flex-1",
        false: "flex-initial",
      },
    },
    defaultVariants: {
      variant: "underline",
      fullWidth: true,
    },
  }
);

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof tabsTriggerVariants>
>(({ className, variant: variantProp, fullWidth, ...props }, ref) => {
  const variantContext = React.useContext(TabsVariantContext);
  const variant = variantProp ?? variantContext;

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(tabsTriggerVariants({ variant, fullWidth, className }))}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));

TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
