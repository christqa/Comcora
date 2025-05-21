"use client";

import React from "react";
import { ExportModalContent } from "@/features/transactions/components/ExportModalContent";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { WithSheet } from "@/components/ui/WithSheet";

interface PaymentSuccessSideBarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}

export function PaymentSuccessSideBar({
  open,
  setOpen,
  selectedOption,
  setSelectedOption,
}: PaymentSuccessSideBarProps) {
  const { t } = useTranslation();

  return (
    <WithSheet
      open={open}
      onClose={() => setOpen(false)}
      trigger={<div></div>}
      title={
        <div className="text-20-medium text-typography-primary">
          {t("transactions.exportFormat")}
        </div>
      }
      actionButtons={
        <div className="flex flex-col gap-4 bg-fill-background-main pt-6">
          <Button
            onClick={() => {
              setTimeout(() => setOpen(false), 600);
            }}
            size="L"
            variant="accent"
            disabled={!selectedOption.length}
          >
            {t("common.buttonText.save")}
          </Button>
        </div>
      }
    >
      <ExportModalContent
        setSelectedOption={setSelectedOption}
        selectedOption={selectedOption}
      />
    </WithSheet>
  );
}
