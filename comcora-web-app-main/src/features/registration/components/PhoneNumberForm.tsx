"use client";

import { useState, type FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppDownload } from "@/features/login/components/AppDownload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { mobilePhoneSchema } from "@/lib/validators/mobile-phone";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { InputTel } from "@/components/ui/input-tel";

import { ConfirmationCode } from "./ConfirmationCode";

const formSchema = z.object({
  phoneNumber: mobilePhoneSchema,
});

export const PhoneNumberForm: FC = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);

  const currentStep = parseInt(searchParams.get("step") ?? "1", 10);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const phoneNumber = form.watch("phoneNumber");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setConfirm(true);
  };

  const updateStep = (step: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("step", step.toString());
    router.push(`?${newSearchParams.toString()}`);
  };

  return (
    <div className={"flex h-full max-w-[400px] flex-col justify-between"}>
      <div
        className={"flex flex-1 flex-col items-center justify-center gap-10"}
      >
        {confirm ? (
          <div
            className={
              "flex h-full flex-col items-center justify-center gap-10"
            }
          >
            <h2 className="text-center text-32-medium text-typography-primary">
              {t("auth.confirmation.enterCode")}
            </h2>
            <p className="text-center text-16-medium text-typography-primary">
              {t("auth.confirmation.enterSentCode")}{" "}
              <span className="text-typography-secondary">{phoneNumber}</span>
            </p>
            <ConfirmationCode onConfirm={() => updateStep(currentStep + 1)} />
          </div>
        ) : (
          <div className="flex flex-col justify-center gap-6">
            <h2 className="text-center text-32-medium text-typography-primary">
              {t("auth.credentials.phoneNumber")}
            </h2>
            <Form {...form}>
              <form
                className={"flex w-full flex-col gap-y-6"}
                onSubmit={form.handleSubmit(onSubmit)}
                action=""
              >
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputTel
                          placeholder={"+372"}
                          clearable
                          isPlaceholderNotTransformed={true}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <p className="text-center text-12-medium text-typography-disabled">
                  {t("auth.registration.confirmPersonalData", {
                    button: t("common.buttonText.confirm"),
                  })}
                </p>

                <Button
                  className={"flex-1 px-0"}
                  variant="accent"
                  size="L"
                  type="submit"
                  disabled={
                    form.formState.isSubmitting || !form.formState.isValid
                  }
                >
                  {t("common.buttonText.continue")}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>

      {!confirm && <AppDownload />}
    </div>
  );
};
