"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { api } from "@/features/trpc-client/hooks/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { hashPin } from "@/lib/crypto";
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

export const PinLockForm = (props: {
  onInit: () => void;
  onSuccess: () => void;
  onFailure: () => void;
}) => {
  const { t } = useTranslation();
  const { onInit, onSuccess, onFailure } = props;
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: "",
    },
  });

  const { mutateAsync: checkEncryptedPin } =
    api.auth.checkEncryptedPin.useMutation();

  const handleChange = async (event: React.ChangeEvent<HTMLFormElement>) => {
    const pinValue = event.target.value;

    if (pinValue.length === 4) {
      onInit();
      const accessPinEncryptionNonce = localStorage.getItem(
        "accessPinEncryptionNonce"
      );

      if (!accessPinEncryptionNonce) {
        router.replace("/");
        return;
      }

      const digest = await hashPin(pinValue, accessPinEncryptionNonce);
      const { success } = await checkEncryptedPin({ pin: digest });
      if (success) {
        sessionStorage.setItem("encryptedAccessPin", digest);
        onSuccess();
      } else {
        onFailure();
      }
    }
  };

  return (
    <Form {...form}>
      <form
        className={"flex flex-col gap-y-8"}
        onChange={handleChange}
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
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="hidden" type="submit">
          {t("auth.pinSetUp.comeUpWithCode")}
        </Button>
      </form>
    </Form>
  );
};
