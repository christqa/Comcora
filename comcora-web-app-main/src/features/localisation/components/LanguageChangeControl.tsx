"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { i18n } from "@/i18n-config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { ListOptionContent } from "@/components/ui/list-option-content";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioOption } from "@/components/ui/radio-option";

const formSchema = z.object({
  locale: z.string(),
});

type LanguageChangeFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<unknown>;
};

export function LanguageChangeControl() {
  const { i18n: i18nInstance } = useTranslation();

  const currentLocale = i18nInstance.language;
  const router = useRouter();
  const currentPathname = usePathname();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locale: currentLocale,
    },
  });

  function onChange(value: string) {
    const newLocale = value;

    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    if (currentLocale === i18n.defaultLocale && !i18n.prefixDefault) {
      router.push("/" + newLocale + currentPathname);
    } else {
      router.push(
        currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
      );
    }

    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"primary"}
          size={"S"}
          className={
            "w-[64px] rounded-xl pl-4 pr-2 text-14-medium uppercase  shadow-s"
          }
        >
          {currentLocale}
          <Icon name="16/Primary/ArrowDown" className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 rounded-3xl border-0 p-0"
      >
        <Form {...form}>
          <FormField
            control={form.control}
            name="locale"
            render={({ field }) => (
              <FormItem className={"w-full"}>
                <FormControl>
                  <RadioGroup
                    onValueChange={onChange}
                    defaultValue={field.value}
                  >
                    <DropdownMenuItem className={"h-12"}>
                      <RadioOption
                        listItemVariant={"default"}
                        id={"lang-et"}
                        value={"et"}
                        className={
                          "flex-row-reverse gap-x-1 bg-transparent p-0 text-14-medium text-typography-primary"
                        }
                        radioIconType={"rounded"}
                      >
                        <ListOptionContent title={"Еести keel"} />
                      </RadioOption>
                    </DropdownMenuItem>
                    <DropdownMenuItem className={"h-12"}>
                      <RadioOption
                        listItemVariant={"default"}
                        id={"lang-en"}
                        value={"en"}
                        className={
                          "flex-row-reverse gap-x-1 bg-transparent p-0 text-14-medium text-typography-primary"
                        }
                        radioIconType={"rounded"}
                      >
                        <ListOptionContent title={"English"} />
                      </RadioOption>
                    </DropdownMenuItem>
                    <DropdownMenuItem className={"h-12"}>
                      <RadioOption
                        listItemVariant={"default"}
                        id={"lang-ru"}
                        value={"ru"}
                        className={
                          "flex-row-reverse gap-x-1 bg-transparent p-0 text-16-medium text-typography-primary"
                        }
                        radioIconType={"rounded"}
                      >
                        <ListOptionContent title={"Русский язык"} />
                      </RadioOption>
                    </DropdownMenuItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
        <DropdownMenuArrow
          className={"h-2 w-4 fill-typography-primary-inverse"}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
