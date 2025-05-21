"use client";

import Link from "next/link";
import Agreements from "@/features/invoices/components/Agreements";
import EInvoices from "@/features/invoices/components/EInvoices";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InvoicesPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-end">
        <Link href={"/private/invoices/new-invoice"}>
          <Button
            size="M"
            variant="secondary-success"
            className="w-40 gap-2 px-4"
          >
            {t("home.links.newInvoice")}
            <Icon
              name="16/Primary/AddCircle"
              className="size-4 text-typography-success"
            />
          </Button>
        </Link>
      </div>
      <Tabs defaultValue="e-invoices" className="w-full">
        <TabsList>
          <TabsTrigger value="e-invoices">
            {t("einvoices.invoices.myEinvoices")}
          </TabsTrigger>
          <TabsTrigger value="agreements">
            {t("einvoices.agreements.myAgreements")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="e-invoices">
          <EInvoices />
        </TabsContent>
        <TabsContent value="agreements">
          <Agreements />
        </TabsContent>
      </Tabs>
    </div>
  );
}
