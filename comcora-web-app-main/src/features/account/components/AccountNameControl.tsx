"use client";

import { useEffect, useState } from "react";
import { useAccount } from "@/features/account/hooks/AccountProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CardSummaryDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TextCounter } from "@/components/ui/text-counter";

const formSchema = z.object({
  name: z.string().min(1),
});

type PageProps = {
  type: string;
  cardData?: CardSummaryDTO;
};

export function AccountNameControl(props: PageProps) {
  const { type, cardData } = props;
  const { t } = useTranslation();
  const { account, renameAccount, renameCard } = useAccount();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    form.reset({
      name: type === "account" ? account?.alias : cardData?.alias,
    });
  }, [account, cardData, form, type]);

  const { toast } = useToast();
  const nameInputValue: string | undefined = form.watch("name");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (type === "account") {
      return renameAccount(values.name).then(() => {
        setOpen(false);
        toast({
          title: t("accounts.messages.accountNameChanged"),
        });
        form.reset({ name: values.name });
      });
    }

    return renameCard(values.name).then(() => {
      setOpen(false);
      toast({
        title: t("accounts.messages.cardNameChanged"),
      });
      form.reset({ name: values.name });
    });
  };

  return (
    <Sheet open={open} onOpenChange={(v) => setOpen(v)}>
      <SheetTrigger asChild={true}>
        <Button
          size="icon"
          variant={type === "card" ? "transparent" : "primary"}
          className={type === "card" ? "size-fit p-0" : ""}
        >
          <Icon
            name={"16/Primary/Rename"}
            className={`size-4 ${type === "card" ? "text-white" : ""}`}
          />
        </Button>
      </SheetTrigger>

      <SheetContent>
        <Form {...form}>
          <form
            className={"flex flex-1 flex-col gap-y-8"}
            onSubmit={form.handleSubmit(onSubmit)}
            action=""
          >
            <SheetHeader>
              <SheetTitle>{t("common.buttonText.rename")}</SheetTitle>

              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          isPlaceholderNotTransformed
                          {...field}
                          autoFocus={true}
                          maxLength={26}
                          clearable
                          onClear={() => form.setValue("name", "")}
                        >
                          <TextCounter
                            maxLength={26}
                            symbolsCount={nameInputValue?.length || 0}
                          />
                        </Input>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </SheetHeader>

            <SheetFooter>
              <Button
                size={"L"}
                variant={"accent"}
                type={"submit"}
                disabled={
                  !form.formState.isValid ||
                  !form.formState.isDirty ||
                  form.formState.isSubmitting
                }
              >
                {t("common.buttonText.save")}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
