"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { passwordSchema } from "@/lib/validators/comcora-password";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z
  .object({
    newPassword: passwordSchema,
    repeatPassword: passwordSchema,
  })
  .superRefine(({ newPassword, repeatPassword }, ctx) => {
    if (newPassword !== repeatPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });

export const NewPasswordForm = (props: {
  onInit: () => void;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();

  const { onInit, onSuccess } = props;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      repeatPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    onInit();
    return new Promise((r) =>
      setTimeout(() => {
        onSuccess();
        r(true);
      }, 1500)
    );
  }

  return (
    <Form {...form}>
      <form
        className={"flex flex-col gap-y-8"}
        onSubmit={form.handleSubmit(onSubmit)}
        action=""
      >
        <div>
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    isPlaceholderNotTransformed={true}
                    placeholder={t("auth.newPassword.newPassword")}
                    listItemVariant={"split-up"}
                    type={"password"}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="repeatPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    isPlaceholderNotTransformed={true}
                    placeholder={t("auth.newPassword.repeatPassword")}
                    listItemVariant={"split-down"}
                    type={"password"}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button
          variant="accent"
          size="L"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {t("common.buttonText.continue")}
        </Button>
      </form>
    </Form>
  );
};
