import React, { type PropsWithChildren } from "react";
import { AccountConfirmationCode } from "@/features/account/components/AccountConfirmationCode";
import { type DialogProps } from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

type PhoneConfirmationDialogProps = DialogProps & {
  onSubmit: () => void;
  onDismiss: () => void;
};

export function PhoneConfirmationDialog(
  props: PropsWithChildren<PhoneConfirmationDialogProps>
) {
  const { t } = useTranslation();
  const { onSubmit, onDismiss, ...dialogProps } = props;

  return (
    <Dialog {...dialogProps}>
      <DialogContent className="w-[400px] bg-fill-background-main">
        <AccountConfirmationCode />
        <DialogFooter>
          <Button variant={"accent"} size={"L"} onClick={onSubmit}>
            {t("common.buttonText.continue")}
          </Button>
          <Button
            variant="link"
            className="mt-8 text-center hover:no-underline"
            onClick={onDismiss}
          >
            <span className="whitespace-normal break-words text-center text-16-medium text-typography-success">
              {t("common.dialog.noOldPhoneAccess")}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
