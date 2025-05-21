"use client";

import { useState, type FC } from "react";
import InvoiceOption from "@/features/invoices/components/InvoiceOption";
import InvoiceTypeDropdown from "@/features/invoices/components/InvoiceTypeDropdown";
import { type InvoiceProps } from "@/features/invoices/components/WaitingPaymentWidget";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { WithSheet } from "@/components/ui/WithSheet";

import DeleteModal from "./DeleteModal";
import { InvoiceOptionContent } from "./InvoiceOptionContent";

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

type InvoiceActionsProps = {
  onPay: () => void;
  onDelete: () => void;
};

const InvoiceActions: FC<InvoiceActionsProps> = ({ onPay, onDelete }) => {
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

export default function AllInvoicesWidget() {
  const { t } = useTranslation();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openInvoiceId, setOpenInvoiceId] = useState<number>();
  return (
    <div className="flex w-[41rem] flex-col items-center gap-y-4">
      <div className="flex w-full justify-between">
        <span className="grow text-24-medium text-typography-primary">
          {t("einvoices.invoices.allAccounts")}
        </span>
        <InvoiceTypeDropdown />
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
            title={t("einvoices.invoice.eInvoice")}
            actionButtons={
              <InvoiceActions
                onPay={() => console.log("on pay")}
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
          setOpenDeleteModal(false);
          setOpenInvoiceId(undefined);
        }}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        description={t("einvoices.agreements.endAgreementInfo")}
        btnText={t("einvoices.agreements.endAgreement")}
      />
    </div>
  );
}
