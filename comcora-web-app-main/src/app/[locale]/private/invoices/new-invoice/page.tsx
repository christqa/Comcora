"use client";

import { AccountsProvider } from "@/features/account/hooks/AccountsProvider";
import ConfirmationProvider from "@/features/confirmation/hooks/ConfirmationContext";
import AccountsSelect from "@/features/invoices/components/AccountsSelect";
import InvoiceForm from "@/features/invoices/components/InvoiceForm";
import SingleCompanyForm from "@/features/invoices/components/SingleCompanyForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { BackNavigationControl } from "@/components/ui/BackNavigationControl";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  originatorRequisiteId: z.string().optional(),
});

export default function NewInvoice() {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <BackNavigationControl />
        <h4 className="text-32-medium text-typography-primary">
          {t("einvoices.invoices.newEInvoice")}
        </h4>
      </div>
      <Form {...form}>
        <form>
          <AccountsProvider>
            <AccountsSelect name={"originatorRequisiteId"} />
          </AccountsProvider>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">
                {t("einvoices.fromEveryCompany")}
              </TabsTrigger>
              <TabsTrigger value="single">
                {t("einvoices.fromSingleCompany")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ConfirmationProvider>
                <InvoiceForm />
              </ConfirmationProvider>
            </TabsContent>
            <TabsContent value="single">
              <ConfirmationProvider>
                <SingleCompanyForm />
              </ConfirmationProvider>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
