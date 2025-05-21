import React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";

type EmailConfirmationDialogProps = DialogProps & {
  email: string;
  onSubmit: () => void;
};

export function EmailConfirmationDialog(props: EmailConfirmationDialogProps) {
  const { t } = useTranslation();
  const { email, onSubmit, ...dialogProps } = props;
  return (
    <Dialog {...dialogProps}>
      <DialogContent className="bg-fill-background-main">
        <div className="flex flex-col items-center gap-4">
          <Icon name={"40/Success/Message"} className="size-10" />
        </div>
        <p className="text-center text-32-medium text-typography-primary">
          {t("common.dialog.sendCodeToEmail")}
        </p>
        <span className="text-center text-16-medium text-typography-secondary">
          {email}
        </span>
        <DialogFooter>
          <Button
            variant={"primary-inverse"}
            size={"L"}
            onClick={() => onSubmit()}
          >
            {t("common.buttonText.send")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
