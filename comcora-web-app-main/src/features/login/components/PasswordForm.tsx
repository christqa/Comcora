"use client";

import Link from "next/link";
import { LoginWithQr } from "@/features/login/components/LoginWithQr";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { passwordSchema } from "@/lib/validators/comcora-password";
import { comcoraUsernameSchema } from "@/lib/validators/comcora-username";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { usePasswordLoginMethod } from "../hooks/usePasswordLoginMethod";

const formSchema = z.object({
  username: comcoraUsernameSchema,
  password: passwordSchema,
});

export const PasswordForm = () => {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    //TODO: Bring back validation after testing
    // resolver: zodResolver(formSchema),
    defaultValues: {
      username: "magi_toomas",
      password: "MindYourOwnBusiness",
    },
  });

  const { proceed } = usePasswordLoginMethod();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await proceed(values);
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
                    placeholder={t("auth.credentials.login")}
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    isPlaceholderNotTransformed={true}
                    type="password"
                    placeholder={t("auth.credentials.password")}
                    listItemVariant={"split-down"}
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

        <Link
          href={"/forgot-password"}
          className="text-center text-14-medium text-typography-success"
        >
          {t("auth.forgotPassword.title")}
        </Link>
      </form>
    </Form>
  );
};
