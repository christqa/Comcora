"use client";

import { useState, type FC } from "react";
import { useRouter } from "next/navigation";
import type { Transaction } from "@xdatagroup/tbb-sdk";
import { useTranslation } from "react-i18next";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { WithSheet } from "@/components/ui/WithSheet";

import { ExportModalContent } from "./ExportModalContent";
import {
  TransactionHistoryOption,
  type TransactionContext,
} from "./TransactionHistoryOption";
import { TransactionHistoryOptionContent } from "./TransactionHistoryOptionContent";

type TransactionActionsProps = {
  onRepeat: () => void;
  onExport: () => void;
  isOutgoingOperation: boolean;
};

export const TransactionActions: FC<TransactionActionsProps> = ({
  onRepeat,
  onExport,
  isOutgoingOperation,
}) => {
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const { t } = useTranslation();
  const { toast } = useToast();

  const onSave = () => {
    onExport();
    setExportModalOpen(false);
    toast({
      title: t("cards.messages.fileSaved"),
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-4 bg-fill-background-main">
        {isOutgoingOperation && (
          <Button onClick={onRepeat} size="L" variant="accent">
            {t("common.buttonText.repeat")}
          </Button>
        )}
        <WithSheet
          open={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          trigger={
            <Button
              onClick={() => setExportModalOpen(true)}
              size="L"
              variant="secondary-success"
            >
              {t("common.buttonText.export")}
            </Button>
          }
          title={t("transactions.exportFormat")}
          actionButtons={
            <Button
              disabled={!selectedOption}
              onClick={onSave}
              size="L"
              className="w-full"
              variant="accent"
            >
              {t("common.buttonText.save")}
            </Button>
          }
        >
          <ExportModalContent
            setSelectedOption={setSelectedOption}
            selectedOption={selectedOption}
          />
        </WithSheet>
      </div>
    </div>
  );
};

interface TransactionHistoryItemProps {
  context?: TransactionContext;
  transaction: Transaction & { accountAlias?: string };
  accountId?: string;
  cardId?: string;
}

export const TransactionHistoryItem = ({
  context,
  transaction,
  accountId,
  cardId,
}: TransactionHistoryItemProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 0);
  };

  const handleExport = () => {
    setOpen(false);
  };

  const handleRepeat = async () => {
    setOpen(false);
    if (transaction.isWithinOwnAccounts) {
      router.push(
        `/private/payments/between-accounts?paymentId=${transaction.id}`
      );
    } else {
      router.push(`/private/payments/new-payment?paymentId=${transaction.id}`);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <WithSheet
      open={open}
      onClose={handleClose}
      bgImage="/transaction-background.png"
      trigger={
        <div onClick={() => setOpen(true)}>
          <TransactionHistoryOption
            {...transaction}
            context={context}
            accountId={accountId}
            cardId={cardId}
            accountAlias={transaction.accountAlias ?? ""}
          />
        </div>
      }
      title={
        <div className="z-2 text-20-medium text-typography-primary">
          {t("transactions.status.completed")}
        </div>
      }
      actionButtons={
        <TransactionActions
          onRepeat={handleRepeat}
          onExport={handleExport}
          isOutgoingOperation={transaction.isOutgoingOperation}
        />
      }
      handleScroll={handleScroll}
      isScrolled={isScrolled}
    >
      <TransactionHistoryOptionContent {...transaction} />
    </WithSheet>
  );
};
