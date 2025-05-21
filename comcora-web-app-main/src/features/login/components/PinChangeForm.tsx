"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const formSchema = z.object({
  pin: z.string().length(4),
});

export const PinChangeForm = (props: {
  currentPin: string;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  className: string;
  onChange: () => void;
}) => {
  const { t } = useTranslation();
  const { onSubmit, currentPin, className, onChange } = props;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: currentPin || "",
    },
  });

  useEffect(() => {
    form.reset();
    form.setValue("pin", currentPin || "");
  }, [currentPin]);

  return (
    <Form {...form}>
      <form
        className={"flex flex-col gap-8"}
        onSubmit={form.handleSubmit(onSubmit)}
        onChange={onChange}
        action=""
      >
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP
                  maxLength={4}
                  {...field}
                  autoFocus={true}
                  mask={true}
                  aria-label="PIN"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className={className} />
                    <InputOTPSlot index={1} className={className} />
                    <InputOTPSlot index={2} className={className} />
                    <InputOTPSlot index={3} className={className} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          size="L"
          variant="accent"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
          aria-label={t("common.buttonText.continue")}
        >
          {t("common.buttonText.continue")}
        </Button>
      </form>
    </Form>
  );
};
