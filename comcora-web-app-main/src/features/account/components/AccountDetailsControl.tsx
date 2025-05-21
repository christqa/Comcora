"use client";

import { useState } from "react";
import { useAccount } from "@/features/account/hooks/AccountProvider";
import { useTranslation } from "react-i18next";

import { formatIban, maskAccountNumber } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function AccountDetailsControl() {
  const { account } = useAccount();
  const { t, i18n: i18nInstance } = useTranslation();
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const handleCopy = () => {
    setOpen(false);
    if (account) {
      void navigator.clipboard
        .writeText(
          [
            `${t("common.credentials.recipientName")}: ` +
              account.requisite.financialInstitutionName,
            "IBAN: " + account.number,
            "BIC/SWIFT: " + account.requisite.financialInstitutionBic,
            `${t("common.credentials.bankAddress")}: ` +
              account.requisite.financialInstitutionAddress,
          ].join("\n")
        )
        .then(() => {
          toast({
            title: t("accounts.messages.dataCopied"),
          });
        });
    }
  };
  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild={true}>
        <Button size="S" variant="primary">
          {account ? maskAccountNumber(account?.number) : "*********"}
        </Button>
      </DialogTrigger>

      <DialogContent className={"w-[400px]"}>
        <div className="flex gap-x-2">
          <span className="text-14-medium leading-4 text-typography-secondary">
            {t("common.credentials.recipientName")}
          </span>
          <p className="grow text-right text-14-medium leading-4 text-typography-primary">
            {account?.requisite.financialInstitutionName}
          </p>
        </div>
        <div className="flex gap-x-2">
          <span className="text-14-medium leading-4 text-typography-secondary">
            IBAN
          </span>
          <p className="grow text-right text-14-medium leading-4 text-typography-primary">
            {account ? formatIban(account?.number) : ""}
          </p>
        </div>
        <div className="flex justify-end gap-x-2">
          <span className="text-14-medium leading-4 text-typography-secondary">
            BIC/SWIFT
          </span>
          <span className="grow text-right text-14-medium leading-4 text-typography-primary">
            {account?.requisite.financialInstitutionBic}
          </span>
        </div>
        <div className="flex justify-end gap-x-2">
          <p className="text-14-medium leading-4 text-typography-secondary">
            {t("common.credentials.bankAddress")}
          </p>
          <p className="grow text-right text-14-medium leading-4 text-typography-primary">
            {account?.requisite.financialInstitutionAddress}
          </p>
        </div>
        <Button variant={"accent"} size={"L"} onClick={handleCopy}>
          {t("common.buttonText.copyData")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
