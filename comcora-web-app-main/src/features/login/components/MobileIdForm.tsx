"use client";

import { LoginWithQr } from "@/features/login/components/LoginWithQr";
import { useMobileIdLoginMethod } from "@/features/login/hooks/useMobileIdLoginMethod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { comcoraUsernameSchema } from "@/lib/validators/comcora-username";
import { mobilePhoneSchema } from "@/lib/validators/mobile-phone";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputTel } from "@/components/ui/input-tel";

const formSchema = z.object({
  username: comcoraUsernameSchema,
  phoneNumber: mobilePhoneSchema,
});

export const MobileIdForm = () => {
  const { proceed } = useMobileIdLoginMethod();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    //TODO: Bring back validation after testing
    // resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "+37060000666",
      username: "ivanov_vlad",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    proceed(values);
  }

  console.log("Form", form.getValues());

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
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputTel
                    placeholder={t("auth.credentials.phoneNumber")}
                    listItemVariant={"split-down"}
                    isPlaceholderNotTransformed={true}
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
