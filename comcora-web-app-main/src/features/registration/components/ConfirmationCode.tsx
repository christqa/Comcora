"use client";

import { Suspense } from "react";
import { OtpCountdownControl } from "@/features/otp/components/OtpCountdownControl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

interface ConfirmationCodeProps {
  onConfirm: () => void;
}

export function ConfirmationCode({ onConfirm }: ConfirmationCodeProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onConfirm();
  };

  const handleChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    const codeValue = event.target.value;

    if (codeValue.length === 6) {
      onConfirm();
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} onChange={handleChange}>
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
        </form>
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
