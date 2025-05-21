"use client";

import { useState, type FC } from "react";
import { AppDownload } from "@/features/login/components/AppDownload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { mobilePhoneSchema } from "@/lib/validators/mobile-phone";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LoaderModal } from "@/components/ui/loader-modal";
import { Overlay } from "@/components/ui/overlay";

const formSchema = z.object({
  createdPassword: mobilePhoneSchema,
});

type CreatePasswordFormProps = {
  nextStep: () => void;
};

export const CreatePasswordForm: FC<CreatePasswordFormProps> = ({
  nextStep,
}) => {
  const { t } = useTranslation();
  const [storedPassword, setStoredPassword] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { createdPassword: "" },
  });

  const handleContinueClick = () => {
    if (storedPassword) {
      if (storedPassword === inputValue) {
        setError(null);
        form.setValue("createdPassword", storedPassword);
        setSuccess(true);
      } else {
        setError(t("auth.registration.passwordMismatch"));
      }
    } else {
      setStoredPassword(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex h-full max-w-[400px] flex-col justify-between">
      <div className="flex flex-1 flex-col items-center justify-center gap-10">
        <div>
          <h2 className="mb-4 text-center text-32-medium text-typography-primary">
            {storedPassword
              ? t("auth.newPassword.repeatPassword")
              : t("auth.newPassword.comeUpWithNewPassword")}
          </h2>
          <p className="text-center text-16-medium text-typography-secondary">
            {t("auth.newPassword.newPasswordHint")}
          </p>
        </div>
        <InputOTP
          maxLength={6}
          autoFocus
          aria-label="createdPassword"
          onChange={(value) => setInputValue(value)}
          value={inputValue ?? ""}
          mask
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
        <Button
          className="w-full"
          variant={"accent"}
          onClick={handleContinueClick}
          size={"L"}
        >
          {storedPassword
            ? t("common.buttonText.set")
            : t("common.buttonText.continue")}
        </Button>
      </div>

      <Dialog
        open={Boolean(error)}
        onOpenChange={(open) => !open && setError(null)}
      >
        <DialogContent className={"w-[400px]"}>
          <DialogHeader>
            <Icon
              className={"size-10 text-icon-critical"}
              name={"40/Crirical/Error"}
            />
            <DialogTitle>
              {/*{error?.message}*/}
              {t("auth.error.text")}
            </DialogTitle>
            <DialogDescription className="mx-auto w-4/5">
              {/*{error?.description}*/}
              {t("auth.error.authErrorMessageDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"accent"}
              size={"L"}
              onClick={() => setError(null)}
            >
              {t("common.buttonText.tryAgain")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={success} onOpenChange={(open) => setSuccess(open)}>
        <DialogContent>
          <DialogHeader>
            <Icon className={"size-10"} name={"40/Success/Check"} />
            <DialogTitle>{t("auth.newPassword.newPasswordSet")}</DialogTitle>
            <DialogDescription>
              {t("auth.newPassword.newPasswordSetHint")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={"accent"} size={"L"} onClick={nextStep}>
              {t("common.buttonText.continue")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Overlay visible={progress}>
        <LoaderModal visible={loading} />
      </Overlay>
      <AppDownload />
    </div>
  );
};
