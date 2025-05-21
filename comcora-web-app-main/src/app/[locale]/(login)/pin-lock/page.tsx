"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PinLockForm } from "@/features/login/components/PinLockForm";
import { type ErrorObject } from "@/features/login/hooks/LoginContext";
import { useTranslation } from "react-i18next";

import { BackNavigationControl } from "@/components/ui/BackNavigationControl";
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

export default function PinLockPage() {
  const { t } = useTranslation();

  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorObject | null>(null);
  const router = useRouter();

  const dismissError = () => {
    setProgress(false);
    setError(null);
  };

  const completeFlow = () => {
    setSuccess(false);
    router.push("/private");
  };

  return (
    <div className="relative w-full">
      <div className="flex flex-col gap-10">
        <div className={"fixed left-8 top-[115px]"}>
          <BackNavigationControl />
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-center text-32-medium text-typography-primary">
            {t("home.hello")}
            <br />
            Роман!
          </h4>
          <p className="text-center text-16-medium text-typography-secondary">
            {t("auth.pinSetUp.enterPinCode")}
          </p>
        </div>

        <PinLockForm
          onInit={() => {
            setProgress(true);
            setLoading(true);
          }}
          onSuccess={() => {
            setProgress(false);
            setLoading(false);
            completeFlow();
          }}
          onFailure={() => {
            setProgress(false);
            setLoading(false);
            setError(new Error("Invalid pin"));
          }}
        />
        <Link
          href={"/"}
          className="text-center text-14-medium text-typography-success"
        >
          {t("auth.pinSetUp.forgotCode")}
        </Link>
      </div>

      <Dialog
        open={Boolean(error)}
        onOpenChange={(open) => !open && dismissError()}
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
            <Button variant={"accent"} size={"L"} onClick={dismissError}>
              {t("common.buttonText.tryAgain")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={success} onOpenChange={(open) => setSuccess(open)}>
        <DialogContent>
          <DialogHeader>
            <Icon className={"size-10"} name={"40/Success/Check"} />
            <DialogTitle>{t("auth.newPasswordSet")}</DialogTitle>
            <DialogDescription>
              {t("auth.yourDataSecureMessage")}
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
