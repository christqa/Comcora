"use client";

import { LoginWithQr } from "@/features/login/components/LoginWithQr";
import { useSmartIdLoginMethod } from "@/features/login/hooks/useSmartIdLoginMethod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { comcoraUsernameSchema } from "@/lib/validators/comcora-username";
import { estonianIdSchema } from "@/lib/validators/estonian-id-code";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: comcoraUsernameSchema,
  personalCode: estonianIdSchema,
});

export const SmartIdForm = () => {
  const { proceed } = useSmartIdLoginMethod();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      // personalCode: "39107100010",
      // username: "cherkaev",
      personalCode: "30303039816",
      username: "smirnov_petr",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    proceed(values);
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    isPlaceholderNotTransformed={true}
                    placeholder={t("auth.credentials.userId")}
                    listItemVariant={"split-up"}
                    clearable
                    onClear={() => form.setValue("username", "")}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="personalCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    isPlaceholderNotTransformed={true}
                    placeholder={t("auth.credentials.personalId")}
                    listItemVariant={"split-down"}
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
