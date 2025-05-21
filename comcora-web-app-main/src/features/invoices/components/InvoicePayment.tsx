"use client";

import { useState } from "react";
import Link from "next/link";
import { AccountsProvider } from "@/features/account/hooks/AccountsProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { mockInvoice } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ListOption } from "@/components/ui/list-option";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Thumbnail } from "@/components/ui/thumbnail";
import { WithSheet } from "@/components/ui/WithSheet";

import AccountsSelect from "./AccountsSelect";
import { InvoiceBeneficiaryContent } from "./InvoiceBeneficiaryContent";

const formSchema = z.object({
  account: z.string().optional(),
});

export const InvoicePayment = () => {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [showBeneficiaryDetails, setShowBeneficiaryDetails] = useState(false);

  const onShowAgreementDetails = () => {
    console.log("agreement details");
  };

  const onCloseAgreementDetails = () => {
    setShowBeneficiaryDetails(false);
  };

  return (
    <Form {...form}>
      <form>
        <div className="flex flex-col gap-10">
          <div className="flex w-full flex-col justify-between">
            <span className="mb-4 grow text-24-medium text-typography-primary">
              {t("einvoices.invoices.transferFrom")}
            </span>
            <AccountsProvider>
              <AccountsSelect name={"account"} />
            </AccountsProvider>
          </div>
          <div>
            <p className="mb-4 grow text-24-medium text-typography-primary">
              {t("einvoices.invoices.recipient")}
            </p>
            <WithSheet
              open={showBeneficiaryDetails}
              onClose={onCloseAgreementDetails}
              trigger={
                <ListOption onClick={() => setShowBeneficiaryDetails(true)}>
                  <Thumbnail variant="light"></Thumbnail>
                  <div className="flex flex-col gap-x-4">
                    <span className="grow text-left text-16-semibold text-typography-primary">
                      {mockInvoice.beneficiary.name}
                    </span>
                    <span className="text-left text-12-medium text-typography-secondary">
                      {mockInvoice.beneficiary.accountNumber}
                    </span>
                  </div>
                </ListOption>
              }
              actionButtons={
                <Button
                  onClick={onShowAgreementDetails}
                  size="L"
                  variant="secondary-success"
                >
                  {t("einvoices.agreements.seeAgreement")}
                </Button>
              }
              title="Получатель"
            >
              <InvoiceBeneficiaryContent />
            </WithSheet>
          </div>
          <div className="flex w-full flex-col justify-between">
            <p className="mb-4 grow text-24-medium text-typography-primary">
              {t("einvoices.invoices.sumToBeCharged")}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div>
                  <span className="text-32-medium text-typography-primary">
                    {mockInvoice.amount}
                  </span>
                  <span className="ml-1 text-32-medium text-typography-secondary">
                    {mockInvoice.currency}
                  </span>
                </div>
                <SectionTitle>
                  {t("einvoices.invoices.noCommission")}
                </SectionTitle>
              </div>
              <Link href={`${mockInvoice.id}/success`}>
                <Button size="L">{t("einvoices.invoices.pay")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
