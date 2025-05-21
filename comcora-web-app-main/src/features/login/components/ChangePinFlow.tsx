"use client";

import { useEffect, useState, type PropsWithChildren } from "react";
import { PinChangeForm } from "@/features/login/components/PinChangeForm";
import { api } from "@/features/trpc-client/hooks/react";
import { useTranslation } from "react-i18next";

import { hashPin } from "@/lib/crypto";
import { getDeviceFingerprint } from "@/lib/device-fingerprint";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { ListOption } from "@/components/ui/list-option";
import { ListOptionContent } from "@/components/ui/list-option-content";
import { Thumbnail } from "@/components/ui/thumbnail";

type ChangePinStep = "current" | "newCode" | "repeatCode";

type ChangePinFlowProps = {
  param?: string;
};

export function ChangePinFlow(props: PropsWithChildren<ChangePinFlowProps>) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ChangePinStep>("current");
  const [resetNonce, setResetNonce] = useState<{
    access: string;
    reset: string;
  }>({ access: "", reset: "" });
  const [currentPin, setCurrentPin] = useState<string>("");
  const [currentResetPin, setCurrentResetPin] = useState<string>("");
  const [newPin, setNewPin] = useState<string>("");
  const [wrongPin, setWrongPin] = useState(false);

  const { mutateAsync: requestPinReset } =
    api.auth.requestPinReset.useMutation();
  const { mutateAsync: confirmPinReset } =
    api.auth.confirmPinReset.useMutation();

  const { toast } = useToast();

  useEffect(() => {
    setStep("current");
    setNewPin("");
    setCurrentPin("");
    setResetNonce({ access: "", reset: "" });
  }, [open]);

  const verifyCurrentCode = async (values: { pin: string }) => {
    const { pin } = values;
    setCurrentPin(pin);
    const resetPinEncryptionNonce = localStorage.getItem(
      "resetPinEncryptionNonce"
    );

    if (!resetPinEncryptionNonce) {
      setCurrentPin(pin);
      return;
    }

    const digest = await hashPin(
      pin + getDeviceFingerprint(),
      resetPinEncryptionNonce
    );
    const { success, access, reset } = await requestPinReset({ pin: digest });
    setCurrentPin("");
    if (success) {
      setResetNonce({ access, reset });
      setCurrentResetPin(digest);
      setStep("newCode");
    } else {
      //onFailure();
    }
  };

  const verifyNewCode = async (values: { pin: string }) => {
    const { pin } = values;
    setCurrentPin(pin);
    setNewPin(pin);
    setStep("repeatCode");
    setTimeout(() => setCurrentPin(""), 100);
  };

  const repeatCode = async (values: { pin: string }) => {
    const { pin } = values;

    if (pin !== newPin) {
      setTimeout(() => setCurrentPin(""), 100);
      setWrongPin(true);
      return;
    }

    const accessPinDigest = await hashPin(pin, resetNonce.access);
    const resetPinDigest = await hashPin(pin, resetNonce.reset);

    try {
      await confirmPinReset({
        currentPin: currentResetPin,
        accessPin: accessPinDigest,
        resetPin: resetPinDigest,
      });

      localStorage.setItem("accessPinEncryptionNonce", resetNonce.access);
      localStorage.setItem("resetPinEncryptionNonce", resetNonce.reset);
      sessionStorage.setItem("encryptedAccessPin", accessPinDigest);
      setOpen(false);

      toast({
        title: t("profile.settings.pinChange.pinChanged.web"),
      });
    } catch (e) {}
  };

  const submitMap: Record<
    ChangePinStep,
    (values: { pin: string }) => Promise<void>
  > = {
    current: verifyCurrentCode,
    newCode: verifyNewCode,
    repeatCode: repeatCode,
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <ListOption onClick={() => setOpen(true)}>
        <Thumbnail variant={"light"}>
          <Icon name={"24/Primary/Lock"} />
        </Thumbnail>
        <ListOptionContent
          title={t("profile.settings.changeCodePassword.mobile")}
        />
      </ListOption>
      <DialogContent variant={"light"} className={"w-[400px]"}>
        <DialogHeader>
          <DialogTitle>
            {t("profile.settings.changeCodePassword.web")}
          </DialogTitle>
          <DialogDescription>
            <span className="text-typography-primary">
              {step === "current" &&
                t("profile.settings.pinChange.enterCurrentCode")}
              {step === "newCode" &&
                t("profile.settings.pinChange.comeUpWithNewCode.web")}
              {step === "repeatCode" &&
                (!wrongPin
                  ? t("profile.settings.pinChange.enterCodeAgain")
                  : t("profile.settings.pinChange.wrongPin"))}
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <PinChangeForm
            className={
              wrongPin
                ? "pb-2 text-48-medium text-typography-critical"
                : "text-typography-primary"
            }
            currentPin={currentPin}
            onSubmit={submitMap[step]}
            onChange={() => setWrongPin(false)}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
