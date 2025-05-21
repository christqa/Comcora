"use client";

import { useRouter } from "next/navigation";
import { api } from "@/features/trpc-client/hooks/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { hashPin } from "@/lib/crypto";
import { getDeviceFingerprint } from "@/lib/device-fingerprint";
import { randomId } from "@/lib/random-id";
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

export const SetPinForm = (props: {
  onInit: () => void;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();

  const router = useRouter();
  const { mutateAsync: retrievePinEncryptionNonce } =
    api.auth.createNonce.useMutation();
  const { mutateAsync: setEncryptedPin } =
    api.auth.setEncryptedPin.useMutation();

  const { onInit, onSuccess } = props;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: "",
    },
  });

  const handleChange = async (event: React.ChangeEvent<HTMLFormElement>) => {
    const pinValue = event.target.value;

    if (pinValue.length === 4) {
      onInit();
      try {
        const {
          access: accessPinEncryptionNonce,
          reset: resetPinEncryptionNonce,
        } = await retrievePinEncryptionNonce();

        const accessPinDigest = await hashPin(
          pinValue + getDeviceFingerprint(),
          accessPinEncryptionNonce
        );
        const resetPinDigest = await hashPin(
          pinValue + getDeviceFingerprint(),
          resetPinEncryptionNonce
        );

        await setEncryptedPin({
          accessPin: accessPinDigest,
          resetPin: resetPinDigest,
        });
        localStorage.setItem(
          "accessPinEncryptionNonce",
          accessPinEncryptionNonce
        );
        localStorage.setItem(
          "resetPinEncryptionNonce",
          resetPinEncryptionNonce
        );
        sessionStorage.setItem("encryptedAccessPin", accessPinDigest);
        onSuccess();
      } catch (e) {
        console.error(e);
        router.replace("/");
      }
    }
  };

  const handleSkipPinSetup = async () => {
    onInit();
    try {
      const {
        access: accessPinEncryptionNonce,
        reset: resetPinEncryptionNonce,
      } = await retrievePinEncryptionNonce();

      const accessPinDigest = await hashPin(
        randomId() + Date.now() + getDeviceFingerprint(),
        accessPinEncryptionNonce
      );
      const resetPinDigest = await hashPin(
        randomId() + Date.now(),
        resetPinEncryptionNonce
      );

      await setEncryptedPin({
        accessPin: accessPinDigest,
        resetPin: resetPinDigest,
      });
      sessionStorage.setItem(
        "accessPinEncryptionNonce",
        accessPinEncryptionNonce
      );
      sessionStorage.setItem(
        "resetPinEncryptionNonce",
        resetPinEncryptionNonce
      );
      sessionStorage.setItem("encryptedAccessPin", accessPinDigest);
      router.push("/private");
    } catch (e) {
      console.error(e);
      router.replace("/");
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          className={"flex flex-col gap-8"}
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
            {t("common.buttonText.continue")}
          </Button>
        </form>
      </Form>
      <Button
        className="text-center text-14-medium text-typography-success"
        onClick={handleSkipPinSetup}
        variant="link"
      >
        {t("common.buttonText.skip")}
      </Button>
    </>
  );
};
