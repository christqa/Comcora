"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { debounce } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

type SubItems = {
  label: string;
  value: string;
};

export type MenuItem = {
  label: string;
  value: string;
  subItems?: SubItems[];
};

interface PopoverProps {
  items: MenuItem[];
  name: string;
  type: string;
  checkedItems: Record<string, boolean | "indeterminate">;
  setCheckedItems: (value: Record<string, boolean | "indeterminate">) => void;
  handleCheckboxChange: (
    value: string,
    checked: boolean | "indeterminate"
  ) => void;
  handleClearFilter: (event: React.FormEvent) => void;
}

export function MultiChoiceFilter(props: PopoverProps) {
  const {
    items,
    name,
    type,
    checkedItems,
    setCheckedItems,
    handleCheckboxChange,
    handleClearFilter,
  } = props;

  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId");

  useEffect(() => {
    if (accountId && type === "cardsAccounts") {
      setCheckedItems({ ...checkedItems, savingAccount: true });
    }
  }, [accountId, type, setCheckedItems, checkedItems]);

  const debouncedHandleCheckboxChange = debounce(
    (value: string, checked: boolean | "indeterminate") => {
      handleCheckboxChange(value, checked);
    },
    300
  );

  const isAnyChecked = () => {
    return Object.values(checkedItems).some((checked) => checked === true);
  };

  const renderMenuItems = (menuItems: MenuItem[]) => {
    return menuItems.map((item) => (
      <div key={item.value}>
        <div className="flex items-center gap-2 px-4">
          <Checkbox
            id={item.value}
            checked={checkedItems[item.value] ?? false}
            onCheckedChange={(e) =>
              debouncedHandleCheckboxChange(item.value, e)
            }
          />
          <label
            htmlFor={item.value}
            className="grow cursor-pointer py-4 text-14-medium text-typography-primary"
          >
            {item.label}
          </label>
        </div>
        {item.subItems && (
          <div className="ml-6">{renderMenuItems(item.subItems)}</div>
        )}
      </div>
    ));
  };

  return (
    <Popover open={open} onOpenChange={(v) => setOpen(v)}>
      <PopoverTrigger asChild>
        <div
          className={`flex gap-x-1 rounded-xl ${
            open ? "bg-fill-primary-active" : "bg-fill-primary"
          } cursor-pointer py-2 pl-4 pr-2`}
        >
          <span
            className={`text-center text-14-medium ${
              !open && isAnyChecked()
                ? "text-typography-success"
                : "text-typography-primary"
            }`}
          >
            {name}
          </span>
          {!open && isAnyChecked() ? (
            <Button
              variant={"transparent"}
              className={"size-fit p-0 text-typography-success"}
              onClick={handleClearFilter}
            >
              <Icon name="16/Primary/Cross" className="size-4" />
            </Button>
          ) : (
            <Icon name="16/Primary/ArrowDown" className="size-4" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={"w-80 rounded-[1.25rem] bg-fill-primary p-0"}
        sideOffset={12}
      >
        <ScrollArea maxHeight="456px">
          <div>{renderMenuItems(items)}</div>
        </ScrollArea>
        <PopoverArrow className={"h-2 w-4 fill-fill-primary"} />
      </PopoverContent>
    </Popover>
  );
}
