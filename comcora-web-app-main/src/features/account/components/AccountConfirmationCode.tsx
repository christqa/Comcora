"use client";

import { Suspense } from "react";
import { OtpCountdownControl } from "@/features/otp/components/OtpCountdownControl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LoaderModal } from "@/components/ui/loader-modal";
import { Overlay } from "@/components/ui/overlay";

const formSchema = z.object({
  pin: z.string().length(6),
});

export function AccountConfirmationCode() {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: "",
    },
  });

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <h4 className="text-center text-32-medium text-typography-primary">
          {t("auth.confirmation.enterCode")}
        </h4>
        <p className="text-center text-16-medium text-typography-primary">
          {t("auth.confirmation.enterSentCode")} +372 **** ** 48
        </p>
      </div>
      <Form {...form}>
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  autoFocus={true}
                  aria-label="PIN"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    -
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
            </FormItem>
          )}
        />
      </Form>
      <Suspense
        fallback={
          <Overlay visible>
            <LoaderModal visible />
          </Overlay>
        }
      >
        <OtpCountdownControl />
      </Suspense>
    </>
  );
}
