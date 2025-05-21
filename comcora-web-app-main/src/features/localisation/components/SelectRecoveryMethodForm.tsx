"use client";

import { LoginWithQr } from "@/features/login/components/LoginWithQr";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { ListOptionContent } from "@/components/ui/list-option-content";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioOption } from "@/components/ui/radio-option";
import { Thumbnail } from "@/components/ui/thumbnail";

const formSchema = z.object({
  method: z.enum(["phone", "email"]),
});

type SelectRecoveryMethodFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<unknown>;
};

export const SelectRecoveryMethodForm = ({
  onSubmit,
}: SelectRecoveryMethodFormProps) => {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

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
            name="method"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup onChange={field.onChange}>
                    <RadioOption
                      listItemVariant={"split-up"}
                      id={"method-email"}
                      value={"email"}
                      ariaLabel={t("auth.credentials.email")}
                      radioIconType="rectangle"
                    >
                      <Thumbnail variant={"light"}>
                        <Icon
                          name={"24/Primary/Message"}
                          className={"size-6"}
                        />
                      </Thumbnail>
                      <ListOptionContent title={t("auth.credentials.email")} />
                    </RadioOption>

                    <RadioOption
                      listItemVariant={"split-down"}
                      id={"method-phone"}
                      value={"phone"}
                      ariaLabel={t("auth.credentials.phoneNumber")}
                      radioIconType="rectangle"
                    >
                      <Thumbnail variant={"light"}>
                        <Icon name={"24/Primary/Call"} className={"size-6"} />
                      </Thumbnail>
                      <ListOptionContent
                        title={t("auth.credentials.phoneNumber")}
                      />
                    </RadioOption>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className={"grid grid-cols-2 gap-4"}>
          <Button
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
