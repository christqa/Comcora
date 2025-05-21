"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={className}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center p-2 relative items-center",
        caption_label: "text-16-semibold capitalize",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "transparent" }),
          "h-7 w-7 bg-transparent p-0"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-14-medium text-typography-disabled h-10 w-10 p-2 flex justify-center items-center uppercase",
        row: "flex w-full mt-1",
        cell: "h-10 w-10 p-1 text-center flex justify-center items-center text-14-medium text-typography-primary relative [&:has([aria-selected].day-range-start)]:rounded-l-xl [&:has([aria-selected].day-range-end)]:rounded-r-xl [&:has([aria-selected].day-outside)]:bg-fill-background-main [&:has([aria-selected])]:bg-fill-primary-light [&:has([aria-selected])]:text-typography-surface-inverse [&:has([aria-selected].day_today)]:text-typography-success first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-full w-full rounded-lg p-0 aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_range_start: "day-range-start",
        day_selected:
          "bg-fill-accent hover:bg-fill-accent focus:bg-fill-accent",
        day_today: "day_today bg-none text-typography-success",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-fill-primary-light aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <Icon name={"24/Primary/ArrowLeft"} className="size-6" />
        ),
        IconRight: ({ ...props }) => (
          <Icon name={"24/Primary/ArrowRight"} className="size-6" />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
