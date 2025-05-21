"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OtpCountdownControl } from "@/features/otp/components/OtpCountdownControl";
import { api } from "@/features/trpc-client/hooks/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { hashPin } from "@/lib/crypto";
import { getDeviceFingerprint } from "@/lib/device-fingerprint";
import { randomId } from "@/lib/random-id";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LoaderModal } from "@/components/ui/loader-modal";
import { Overlay } from "@/components/ui/overlay";

import { useLogin } from "../hooks/LoginContext";

const formSchema = z.object({
  pin: z.string().length(6),
});

export const SecondStepForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: "",
    },
  });

  const router = useRouter();
  const { mutateAsync: retrievePinEncryptionNonce } =
    api.auth.createNonce.useMutation();
  const { mutateAsync: setEncryptedPin } =
    api.auth.setEncryptedPin.useMutation();

  const searchParams = useSearchParams();
  const otpToken = searchParams.get("otpToken");
  const { completeProgress, displayError } = useLogin();

  const { mutateAsync: verifyCode } = api.auth.verifyOtpCode.useMutation();

  const login = async () => {
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

  const handleChange = async (event: React.ChangeEvent<HTMLFormElement>) => {
    const smsCodeValue = event.target.value;

    if (smsCodeValue.length === 6) {
      try {
        completeProgress();
        if (otpToken) {
          const response = await verifyCode({ otpToken, code: smsCodeValue });
          if (response.success) {
            await login();
          } else {
            throw new Error(response.message as string);
          }
        } else {
          throw new Error("Invalid or missing OTP token.");
        }
      } catch (error) {
        completeProgress();
        displayError({
          message: "Verification failed",
          description: "The code might not be correct",
        });
      }
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
                    maxLength={6}
                    {...field}
                    autoFocus={true}
                    mask={true}
                    aria-label="OTP"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
              </FormItem>
            )}
          />
          <Suspense
            fallback={
              <Overlay visible>
                <LoaderModal visible />
              </Overlay>
            }
          >
            <OtpCountdownControl />
          </Suspense>
        </form>
      </Form>
    </>
  );
};
