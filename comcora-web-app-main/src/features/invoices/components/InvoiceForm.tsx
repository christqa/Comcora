"use client";

import {
  useConfirmation,
  type ConfirmationInit,
} from "@/features/confirmation/hooks/ConfirmationContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { InputTel } from "@/components/ui/input-tel";

const formSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
});

export default function InvoiceForm() {
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "Roman Konstantinopoli",
      email: "",
      phone: "",
    },
  });

  const { confirm } = useConfirmation();
  const { toast } = useToast();

  const handleOpenDialog = async () => {
    // TODO: confirmation is not implemented on the backend side, we will just simulate the process
    const confirmationDetails = await new Promise<ConfirmationInit>((r) => {
      setTimeout(
        () =>
          r({
            type: "phone",
          }),
        600
      );
    });

    const { success } = await confirm(confirmationDetails);

    if (!success) {
      return { success: false };
    }
    return {
      success: true,
    };
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    await handleOpenDialog().then((success) => {
      if (success) {
        toast({
          title: t("einvoices.invoices.orderSentSuccessfully"),
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className={"flex flex-col gap-y-8"}
        onSubmit={form.handleSubmit(onSubmit)}
        action=""
      >
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled
                    listItemVariant={"default"}
                    placeholder={t("einvoices.invoices.payer")}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    listItemVariant={"default"}
                    placeholder="E-mail"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputTel
                    placeholder={t("common.inputLabel.phoneNumber")}
                    listItemVariant={"default"}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Alert className={"rounded-2xl border-0 bg-fill-secondary-success"}>
            <Icon
              name={"16/Primary/Info"}
              className={"size-4 text-typography-success"}
            />
            <AlertDescription
              className={"text-12-medium text-typography-success"}
            >
              {t("einvoices.invoices.contactDetailsInfoAlertDescription")}
            </AlertDescription>
          </Alert>
          <div className="flex justify-end">
            <Button variant="accent" size="L">
              {t("einvoices.invoices.confirmOrder")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
