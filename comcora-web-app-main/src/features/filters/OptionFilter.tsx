"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

interface Filters {
  name: string;
  value: string;
}

type PageProps = {
  filters: Filters[];
  handleOperationTypeChange: (v: string) => void;
  handleOperationTypeClear: (event: React.FormEvent) => void;
  activeFilter: string | undefined;
};

export function OptionFilter(props: PageProps) {
  const {
    filters,
    handleOperationTypeChange,
    handleOperationTypeClear,
    activeFilter,
  } = props;

  return (
    <>
      {filters.map((item) => (
        <div
          key={item.value}
          role={"button"}
          className={`flex gap-x-1 rounded-xl bg-fill-primary ${activeFilter === item.value ? "pl-4 pr-2" : "px-4"} py-2`}
        >
          <span
            className={`inline-block flex-1 text-center text-14-medium ${activeFilter === item.value ? "text-typography-success" : "text-typography-primary"}`}
            onClick={() => handleOperationTypeChange(item.value)}
          >
            {item.name}
          </span>
          {activeFilter === item.value ? (
            <Button
              variant={"transparent"}
              className={"size-fit p-0 text-typography-success"}
              onClick={(e) => handleOperationTypeClear(e)}
            >
              <Icon name="16/Primary/Cross" className="size-4" />
            </Button>
          ) : null}
        </div>
      ))}
    </>
  );
}
