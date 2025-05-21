"use client";

import { AccountsProvider } from "@/features/account/hooks/AccountsProvider";
import ConfirmationProvider from "@/features/confirmation/hooks/ConfirmationContext";
import AccountsSelect from "@/features/invoices/components/AccountsSelect";
import AgreementForm from "@/features/invoices/components/AgreementForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { BackNavigationControl } from "@/components/ui/BackNavigationControl";
import { Form } from "@/components/ui/form";

const formSchema = z.object({
  originatorRequisiteId: z.string().optional(),
});

export default function AgreementPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <BackNavigationControl />
        <h4 className="text-32-medium text-typography-primary">
          Изменить договор
        </h4>
      </div>
      <Form {...form}>
        <form>
          <AccountsProvider>
            <AccountsSelect name={"originatorRequisiteId"} />
          </AccountsProvider>
          <ConfirmationProvider>
            <AgreementForm />
          </ConfirmationProvider>
        </form>
      </Form>
    </div>
  );
}
