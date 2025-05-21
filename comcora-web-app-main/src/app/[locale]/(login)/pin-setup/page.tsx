"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SetPinForm } from "@/features/login/components/SetPinForm";
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

export default function PinSetupPage() {
  const { t } = useTranslation();

  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const completeFlow = () => {
    setSuccess(false);
    router.push("/private");
  };

  return (
    <div className={"relative w-full"}>
      <div
        className={"flex flex-col gap-y-10 rounded-5xl bg-fill-background-main"}
      >
        <div className={"fixed left-8 top-[115px]"}>
          <BackNavigationControl />
        </div>
        <div className="flex flex-col gap-y-4">
          <h4 className="text-center text-32-medium text-typography-primary">
            {t("auth.pinSetUp.comeUpWithCode")}
          </h4>
          <p className="text-center text-16-medium text-typography-secondary">
            {t("auth.pinSetUp.codeActiveOnly")}
            <br />
            {t("auth.pinSetUp.forBrowser")}
          </p>
        </div>

        <SetPinForm
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
      <Dialog open={success} onOpenChange={(open) => setSuccess(open)}>
        <DialogContent className={"w-[400px]"}>
          <DialogHeader>
            <Icon className={"size-10"} name={"40/Success/Check"} />
            <DialogTitle>{t("auth.pinSetUp.codeSet")}</DialogTitle>
            <DialogDescription>
              {t("auth.pinSetUp.editCodeMessage")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={"accent"} size={"L"} onClick={completeFlow}>
              {t("common.buttonText.ready")}
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
