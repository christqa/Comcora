"use client";

import { useState, type PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { SelectRecoveryMethodForm } from "@/features/localisation/components/SelectRecoveryMethodForm";
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

export const SelectRecoveryMethodFlow = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  const { t } = useTranslation();

  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function onSubmit(values: { method: string }) {
    console.log(values);
    setProgress(true);
    setLoading(true);
    return new Promise((r) =>
      setTimeout(() => {
        setProgress(false);
        setLoading(false);
        setSuccess(true);
        r(void 0);
      }, 1500)
    );
  }

  const completeFlow = () => {
    setSuccess(false);
    router.push("/new-password");
  };

  return (
    <div className={cn("relative")}>
      <div className={cn(className, progress && "opacity-20")}>
        {children}
        <SelectRecoveryMethodForm onSubmit={onSubmit} />
      </div>
      <Dialog open={success} onOpenChange={(open) => setSuccess(open)}>
        <DialogContent>
          <DialogHeader>
            <Icon className={"size-10"} name={"40/Success/Check"} />
            <DialogTitle>{t("auth.forgotPassword.authentication")}</DialogTitle>
            <DialogDescription>
              {t("auth.forgotPassword.passwordRecoveryMessage")}{" "}
              <span className={"text-typography-success"}>
                konstantinopolskij@gmail.com
              </span>{" "}
              {t("auth.forgotPassword.checkEmail")}
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
};
