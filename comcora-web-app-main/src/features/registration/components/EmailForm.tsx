"use client";

import { useState } from "react";
import { AppDownload } from "@/features/login/components/AppDownload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { ConfirmationCode } from "./ConfirmationCode";

interface EmailFormProps {
  nextStep: () => void;
}

const formSchema = z.object({
  email: z.string().email(),
});

export function EmailForm({ nextStep }: EmailFormProps) {
  const { t } = useTranslation();
  const [confirm, setConfirm] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const email = form.watch("email");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setConfirm(true);
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
              {t("auth.confirmation.enterCodeEmail")}{" "}
              <span className="text-typography-secondary">{email}</span>
            </p>
            <ConfirmationCode onConfirm={() => nextStep()} />
          </div>
        ) : (
          <>
            <h2 className="text-center text-32-medium text-typography-primary">
              {t("auth.registration.yourEmail")}
            </h2>
            <Form {...form}>
              <form
                className={"flex w-full flex-col gap-y-6"}
                onSubmit={form.handleSubmit(onSubmit)}
                action=""
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          onClear={() => form.setValue("email", "")}
                          clearable
                          placeholder={"Email"}
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
          </>
        )}
      </div>

      {!confirm && <AppDownload />}
    </div>
  );
}
