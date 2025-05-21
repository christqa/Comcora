"use client";

import { LoginWithQr } from "@/features/login/components/LoginWithQr";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { estonianIdSchema } from "@/lib/validators/estonian-id-code";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  personalCode: estonianIdSchema,
});

export const IdCardForm = () => {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalCode: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    return new Promise((r) => setTimeout(r, 1500));
  }

  return (
    <Form {...form}>
      <form
        className={"flex flex-col gap-y-6"}
        onSubmit={form.handleSubmit(onSubmit)}
        action=""
      >
        <div>
          <FormField
            control={form.control}
            name="personalCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    isPlaceholderNotTransformed={true}
                    placeholder={t("auth.credentials.personalId")}
                    listItemVariant={"default"}
                    clearable
                    onClear={() => form.setValue("personalCode", "")}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className={"flex flex-col gap-4"}>
          <Button
            className={"flex-1 px-0"}
            variant="accent"
            size="L"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {t("auth.loginInto")}
          </Button>
          <LoginWithQr />
        </div>
      </form>
    </Form>
  );
};
