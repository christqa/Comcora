"use client";

import { type FC } from "react";
import { useTranslation } from "react-i18next";

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

import { useRegistration } from "../hooks/RegistrationContext";
import { PhoneNumberForm } from "./PhoneNumberForm";

export const RegistrationForm: FC = () => {
  const { t } = useTranslation();
  const { error, dismissError, success, setSuccess } = useRegistration();

  return (
    <div className={"flex h-full flex-col"}>
      <PhoneNumberForm />

      <Dialog open={!!error} onOpenChange={(open) => !open && dismissError()}>
        <DialogContent>
          <DialogHeader>
            <Icon
              className={"size-10 text-icon-critical"}
              name={"40/Crirical/Error"}
            />
            <DialogTitle>{t("auth.error.text")}</DialogTitle>
            <DialogDescription className="mx-auto w-4/5">
              {t("auth.error.authErrorMessageDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={"accent"} size={"L"} onClick={error?.retry}>
              {t("common.buttonText.tryAgain")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
