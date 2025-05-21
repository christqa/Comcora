"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { estonianIdSchema } from "@/lib/validators/estonian-id-code";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useRegistration } from "../hooks/RegistrationContext";

const formSchema = z.object({
  personalCode: estonianIdSchema,
});

export const SmartIdForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setSuccess } = useRegistration();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalCode: "30303039816",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSuccess(true);
  };

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
                    clearable
                    onClear={() => form.setValue("personalCode", "")}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className={"flex flex-col gap-3"}>
          <Button
            className={"flex-1 px-0"}
            variant="accent"
            size="L"
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {t("common.buttonText.continue")}
          </Button>
          <Button
            className="text-center text-14-medium text-typography-success"
            onClick={(e) => {
              e.preventDefault();
              router.push("/");
            }}
            variant="transparent"
          >
            {t("auth.registration.bankLogin")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
