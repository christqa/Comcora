"use client";

import React, { Fragment, useState } from "react";
import { type MenuItem } from "@/features/filters/MultiChoiceFilter";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ListOptionContent } from "@/components/ui/list-option-content";
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioOption } from "@/components/ui/radio-option";

interface SingleChoiceProps {
  items: MenuItem[];
  name: string;
}

export default function SingleChoice({ items, name }: SingleChoiceProps) {
  const [open, setOpen] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState("");

  const onChange = (value: string) => {
    setSelectedChoice(value);
  };

  const handleClearFilter = (event: React.FormEvent) => {
    event.preventDefault();
    setSelectedChoice("");
  };

  return (
    <Popover open={open} onOpenChange={(v) => setOpen(v)}>
      <PopoverTrigger asChild>
        <div
          className={`flex gap-x-1 rounded-xl ${open ? "bg-fill-primary-active" : "bg-fill-primary"} cursor-pointer py-2 pl-4 pr-2`}
        >
          <span
            className={`text-center text-14-medium ${!open && selectedChoice ? "text-typography-success" : "text-typography-primary"}`}
          >
            {name}
          </span>
          {!open && selectedChoice ? (
            <Button
              variant={"transparent"}
              className={"size-fit p-0 text-typography-success"}
              onClick={(e) => handleClearFilter(e)}
            >
              <Icon name="16/Primary/Cross" className="size-4" />
            </Button>
          ) : (
            <Icon name="16/Primary/ArrowDown" className="size-4" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={"rounded-[1.25rem] bg-fill-primary p-0"}
        sideOffset={12}
      >
        <RadioGroup
          onValueChange={onChange}
          value={selectedChoice}
          className="w-[210px]"
        >
          {items.map((item) => (
            <Fragment key={item.value}>
              <RadioOption
                listItemVariant={"default"}
                id={item.value}
                value={item.value}
                className={
                  "flex-row-reverse gap-x-1 bg-transparent px-2 py-1 text-14-medium text-typography-primary"
                }
                radioIconType={"rounded"}
              >
                <ListOptionContent title={item.label} />
              </RadioOption>
            </Fragment>
          ))}
        </RadioGroup>
        <PopoverArrow className={"h-2 w-4 fill-fill-primary"} />
      </PopoverContent>
    </Popover>
  );
}
