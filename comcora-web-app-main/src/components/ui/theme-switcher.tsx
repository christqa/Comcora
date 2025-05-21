"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";

type ModeToggleProps = {
  mode: string;
};

export function ModeToggle(props: ModeToggleProps) {
  const { t } = useTranslation();
  const { mode } = props;
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      {mode === "icon" ? (
        <Button
          variant="outline"
          size="icon"
          className={"border-transparent bg-transparent p-0"}
          onClick={toggleTheme}
        >
          <Icon
            name={"24/Primary/Light"}
            className="size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <Icon
            name={"24/Primary/Dark"}
            className="absolute size-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"primary"}
              size={"S"}
              className={
                "w-[139px] rounded-xl pl-4 pr-2 text-14-medium shadow-s"
              }
            >
              <span className={"dark:hidden"}>
                {t("general.theme.lightMode")}
              </span>
              <span className={"hidden dark:inline-block"}>
                {t("general.theme.darkMode")}
              </span>
              <Icon name="16/Primary/ArrowDown" className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={"w-[240px] border-0 p-0"}>
            <DropdownMenuItem
              className={"h-12 p-4 text-typography-primary"}
              onClick={() => setTheme("light")}
            >
              <div className="flex items-center gap-2">
                <Icon
                  name={"16/Primary/Light"}
                  className="size-4 text-typography-success"
                />
                {t("general.theme.lightMode")}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={"h-12 p-4 text-typography-primary"}
              onClick={() => setTheme("dark")}
            >
              <div className="flex items-center gap-2">
                <Icon
                  name={"16/Primary/Dark"}
                  className="size-4 text-typography-secondary"
                />
                {t("general.theme.darkMode")}
              </div>
            </DropdownMenuItem>
            <DropdownMenuArrow
              className={"h-2 w-4 fill-typography-primary-inverse"}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
