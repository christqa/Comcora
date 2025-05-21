"use client";

import { AccountsProvider } from "@/features/account/hooks/AccountsProvider";
import AccountsSelect from "@/features/invoices/components/AccountsSelect";
import Withdrawal from "@/features/payments/components/Withdrawal";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { BackNavigationControl } from "@/components/ui/BackNavigationControl";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  originatorRequisiteId: z.string().min(1, t("common.form.fieldRequired")),
  amount: z.number(),
  reference: z.string(),
});

export default function Page() {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <BackNavigationControl />
            <h4 className="text-32-medium text-typography-primary">
              {t("payments.requestMoney.title")}
            </h4>
          </div>
          <AccountsProvider>
            <AccountsSelect
              title={t("payments.main.fromWhere")}
              name={"originatorRequisiteId"}
            />
          </AccountsProvider>
          <FormField
            control={form.control}
            name={"reference"}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="h-14"
                    placeholder={t("common.credentials.addComment")}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Withdrawal link={"/private/payments/request-money/content"} />
        </div>
      </form>
    </Form>
  );
}
