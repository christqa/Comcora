"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GoToMain from "@/features/login/components/GoToMain";
import { NewPasswordForm } from "@/features/login/components/NewPasswordForm";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
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
import { LoaderModal } from "@/components/ui/loader-modal";
import { Overlay } from "@/components/ui/overlay";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();

  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const completeFlow = () => {
    setSuccess(false);
    router.push("/");
  };

  return (
    <div className={cn("relative ")}>
      <div
        className={cn(
          " flex w-[26.5rem] flex-col gap-y-8 rounded-5xl bg-fill-background-main p-8",
          progress && "opacity-20"
        )}
      >
        <div className="flex items-center gap-x-4">
          <GoToMain />
        </div>
        <div className="flex flex-col gap-8">
          <h4 className="mx-auto w-4/5 text-center text-32-medium text-typography-primary">
            {t("auth.newPassword.comeUpWithNewPassword")}
          </h4>
          <NewPasswordForm
            onInit={() => {
              setProgress(true);
              setLoading(true);
            }}
            onSuccess={() => {
              setProgress(false);
              setLoading(false);
              setSuccess(true);
            }}
          />
        </div>
      </div>
      <Dialog open={success} onOpenChange={(open) => setSuccess(open)}>
        <DialogContent>
          <DialogHeader>
            <Icon className={"size-10"} name={"40/Success/Check"} />
            <DialogTitle>{t("auth.newPassword.newPasswordSet")}</DialogTitle>
            <DialogDescription>
              {t("auth.newPassword.yourDataSecureMessage")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={"accent"} size={"L"} onClick={completeFlow}>
              {t("common.buttonText.continue")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Overlay visible={progress}>
        <LoaderModal visible={loading} />
      </Overlay>
    </div>
  );
}
