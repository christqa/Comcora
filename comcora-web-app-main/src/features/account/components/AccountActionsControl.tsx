"use client";

import { useState } from "react";
import { AccountSelectableOption } from "@/features/account/components/AccountSelectableOption";
import { useAccount } from "@/features/account/hooks/AccountProvider";
import { useAccounts } from "@/features/account/hooks/AccountsProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { convertToCurrencyObject, maskAccountNumber } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { InfoMessage } from "@/components/ui/InfoMessage";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const formSchema = z.object({
  accountNumber: z.string().min(1),
});

export function AccountActionsControl(props: {
  onClose: () => Promise<{ success: boolean }>;
}) {
  const { t, i18n: i18nInstance } = useTranslation();
  const { onClose } = props;
  const { total, savingsAccounts, multiCurrencyAccounts, privateAccounts } =
    useAccounts();

  const { account, closeAccount } = useAccount();
  const balance = convertToCurrencyObject(account?.balance.currentBalance);
  const [open, setOpen] = useState(false);
  const [isCloseAccountDialogOpen, setIsCloseAccountDialogOpen] =
    useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountNumber: "",
    },
  });

  const { toast } = useToast();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    return closeAccount({
      accountToClose: account!.number,
      accountToTransfer: values.accountNumber,
    }).then(() => {
      setOpen(false);
      toast({
        title: t("accounts.messages.applicationInProgress"),
      });
      form.reset();
    });
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        setIsCloseAccountDialogOpen(false);
      }}
    >
      <SheetTrigger asChild={true}>
        <Button size={"S"} variant={"primary-inverse"} className={"w-[98px]"}>
          {t("common.buttonText.action")}
        </Button>
      </SheetTrigger>

      <SheetContent>
        <Form {...form}>
          <form
            className={"flex flex-1 flex-col gap-y-8"}
            onSubmit={form.handleSubmit(onSubmit)}
            action=""
          >
            <SheetHeader>
              <SheetTitle>
                {isCloseAccountDialogOpen
                  ? t("accounts.widget.closeAccount")
                  : t("accounts.widget.actionWithAccount")}
              </SheetTitle>

              <div className={"flex flex-col gap-y-6"}>
                <div className="flex flex-col gap-y-2">
                  <div className="flex flex-col gap-y-1 rounded-3xl bg-fill-primary p-4">
                    <div className="flex justify-between">
                      <span className="text-12-medium text-typography-secondary">
                        Comcora Main Total
                      </span>
                      <span className="text-12-medium text-typography-secondary">
                        {maskAccountNumber(account?.number)}
                      </span>
                    </div>
                    <div className="flex">
                      <h4 className="text-32-medium text-typography-primary">
                        {balance.base}
                      </h4>
                      <h4 className="text-32-medium text-typography-secondary">
                        ,{balance.decimals} {balance.currencySign}
                      </h4>
                    </div>
                  </div>
                </div>
                {isCloseAccountDialogOpen ? (
                  <>
                    <InfoMessage>
                      {t("accounts.messages.accountClose")}
                    </InfoMessage>
                    <div className="flex flex-col gap-y-2">
                      <span className="text-14-medium text-typography-secondary">
                        {t("accounts.widget.transferToAccount")}
                      </span>
                      <FormField
                        control={form.control}
                        name="accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex flex-col gap-y-1 rounded-3xl bg-fill-primary pb-2">
                                {savingsAccounts.length > 0 && (
                                  <CollapsibleSection
                                    key={"savings"}
                                    title={t("accounts.widget.savingsAccounts")}
                                  >
                                    {savingsAccounts.map((acc) => (
                                      <AccountSelectableOption
                                        key={acc.number}
                                        amount={acc.balance.currentBalance}
                                        currencySymbol={"EUR"}
                                        icon={"24/Colored/Euro"}
                                        description={acc.alias}
                                        checked={
                                          form.getValues().accountNumber ===
                                          acc.number
                                        }
                                        onChangeValue={(v) =>
                                          v && field.onChange(acc.number)
                                        }
                                      />
                                    ))}
                                  </CollapsibleSection>
                                )}

                                {privateAccounts.length > 0 && (
                                  <CollapsibleSection
                                    key={"private"}
                                    title={t(
                                      "accounts.widget.personalAccounts"
                                    )}
                                  >
                                    {privateAccounts.map((acc) => (
                                      <AccountSelectableOption
                                        key={acc.number}
                                        amount={acc.balance.currentBalance}
                                        currencySymbol={"EUR"}
                                        icon={"24/Colored/Euro"}
                                        description={acc.alias}
                                        checked={
                                          form.getValues().accountNumber ===
                                          acc.number
                                        }
                                        onChangeValue={(v) =>
                                          v && field.onChange(acc.number)
                                        }
                                      />
                                    ))}
                                  </CollapsibleSection>
                                )}

                                {multiCurrencyAccounts.length > 0 && (
                                  <CollapsibleSection
                                    key={"multiCurrency"}
                                    title={t(
                                      "accounts.widget.multiCurrencyAccounts"
                                    )}
                                  >
                                    {multiCurrencyAccounts.map((acc) => (
                                      <AccountSelectableOption
                                        key={acc.number}
                                        amount={acc.balance.currentBalance}
                                        currencySymbol={"EUR"}
                                        description={acc.alias}
                                        checked={
                                          form.getValues().accountNumber ===
                                          acc.number
                                        }
                                        onChangeValue={(v) =>
                                          v && field.onChange(acc.number)
                                        }
                                        icon={"24/Primary/Coins"}
                                      />
                                    ))}
                                  </CollapsibleSection>
                                )}
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </SheetHeader>

            <SheetFooter>
              {isCloseAccountDialogOpen ? (
                <Button
                  size={"L"}
                  variant={"accent"}
                  type={"submit"}
                  disabled={
                    !form.formState.isValid || form.formState.isSubmitting
                  }
                  onClick={async () => {
                    setIsCloseAccountDialogOpen(false);
                    await onClose();
                    setOpen(false);
                  }}
                >
                  {t("common.buttonText.transfer")}
                </Button>
              ) : (
                <Button
                  size={"L"}
                  variant={"secondary-critical"}
                  type={"button"}
                  onClick={() => {
                    setIsCloseAccountDialogOpen(true);
                  }}
                >
                  {t("accounts.widget.closeAccount")}
                </Button>
              )}
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
