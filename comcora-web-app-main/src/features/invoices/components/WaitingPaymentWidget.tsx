"use client";

import { useState, type FC } from "react";
import { useRouter } from "next/navigation";
import InvoiceOption from "@/features/invoices/components/InvoiceOption";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { WithSheet } from "@/components/ui/WithSheet";

import DeleteModal from "./DeleteModal";
import { InvoiceOptionContent } from "./InvoiceOptionContent";

export type InvoiceProps = {
  id: number;
  date: string;
  amount: string;
  name: string;
  currencySymbol: "EUR" | "USD";
  debitDate?: string;
};

const invoices: InvoiceProps[] = [
  {
    id: 1,
    date: "30.05.2025",
    amount: "300.00",
    name: "ERGO Insurance SE",
    currencySymbol: "EUR",
  },
  {
    id: 2,
    date: "30.05.2025",
    debitDate: "07.06.2025",
    amount: "455.71",
    name: "AS Comcora Liising",
    currencySymbol: "EUR",
  },
  {
    id: 3,
    date: "30.05.2025",
    debitDate: "07.06.2025",
    amount: "79.00",
    name: "Telia Eesti AS",
    currencySymbol: "EUR",
  },
];

type ActionButtonsProps = {
  onPay: () => void;
  onDelete: () => void;
};

const ActionButtons: FC<ActionButtonsProps> = ({ onPay, onDelete }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4 pt-6">
      <Button
        onClick={onPay}
        className={"h-14 w-full"}
        variant={"accent"}
        size="L"
      >
        {t("common.buttonText.pay")}
      </Button>
      <Button
        className={"h-14 w-full"}
        variant={"secondary-critical"}
        size="L"
        onClick={onDelete}
      >
        {t("common.buttonText.delete")}
      </Button>
    </div>
  );
};

export default function WaitingPaymentWidget() {
  const { t } = useTranslation();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openInvoiceId, setOpenInvoiceId] = useState<number>();
  const router = useRouter();

  const onPay = (id: number) => {
    router.push(`invoices/${id}`);
  };

  return (
    <div className="flex w-[41rem] flex-col items-center gap-y-4">
      <div className="flex w-full justify-between">
        <span className="grow text-24-medium text-typography-primary">
          {t("einvoices.invoices.pendingPayment")}
        </span>
      </div>
      <div className="flex w-full flex-col rounded-3xl bg-fill-primary">
        {invoices.map((item) => (
          <WithSheet
            key={item.id}
            open={openInvoiceId === item.id}
            onClose={() => setOpenInvoiceId(undefined)}
            trigger={
              <div onClick={() => setOpenInvoiceId(item.id)}>
                <InvoiceOption
                  id={item.id}
                  date={item.date}
                  debitDate={item.debitDate}
                  amount={item.amount}
                  name={item.name}
                  currencySymbol={item.currencySymbol}
                  thumbnail={<Icon name="24/Primary/Documents" />}
                />
              </div>
            }
            title={t("einvoices.invoices.eInvoice")}
            actionButtons={
              <ActionButtons
                onPay={() => onPay(item.id)}
                onDelete={() => setOpenDeleteModal(true)}
              />
            }
          >
            <InvoiceOptionContent />
          </WithSheet>
        ))}
      </div>
      <DeleteModal
        onDelete={() => {
          setOpenInvoiceId(undefined);
          setOpenDeleteModal(false);
        }}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        description={t("einvoices.invoices.eInvoiceDeleteWarning")}
        btnText={t("common.buttonText.delete")}
      />
    </div>
  );
}
