"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccounts } from "@/features/account/hooks/AccountsProvider";
import AccountSelectItem from "@/features/invoices/components/AccountSelectItem";
import { type AccountCurrencyCode } from "@/types/local.types";
import { type AccountSummaryDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import { useTranslation } from "react-i18next";

import { currencyDesigns } from "@/lib/currencies";
import {
  FormControl,
  FormField,
  FormItem,
  useFormField,
} from "@/components/ui/form";
import { Icon, type IconName } from "@/components/ui/icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Thumbnail } from "@/components/ui/thumbnail";

type AccountsSelectProps = {
  title?: string;
  name: string;
  setCurrency?: (currency: AccountCurrencyCode) => void;
  setSelectedAccount?: (account: AccountSummaryDTO | undefined) => void;
  selectedAccountNumber?: string;
  isEnoughBalanceHandler?: () => void;
  selectedAccount?: AccountSummaryDTO;
};

export default function AccountsSelect({
  title,
  name,
  setCurrency,
  setSelectedAccount,
  selectedAccountNumber,
  isEnoughBalanceHandler,
  selectedAccount,
}: AccountsSelectProps) {
  const { t } = useTranslation();
  const { savingsAccounts, multiCurrencyAccounts, privateAccounts } =
    useAccounts();
  const { control, setValue } = useFormField();
  const allAccounts = useMemo(() => {
    return [...savingsAccounts, ...multiCurrencyAccounts, ...privateAccounts];
  }, [savingsAccounts, multiCurrencyAccounts, privateAccounts]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (allAccounts.length && allAccounts[0]) {
      const requisite = allAccounts[0].requisite;
      setValue(name, requisite.id);
    }
  }, [allAccounts, setValue, name]);

  useEffect(() => {
    setSelectedAccount?.(allAccounts[0]);
  }, []);

  useEffect(() => {
    isEnoughBalanceHandler?.();
  }, [selectedAccount]);

  useEffect(() => {
    if (selectedAccountNumber) {
      const selectedAccount = allAccounts.find(
        (account) => account.number === selectedAccountNumber
      );

      if (selectedAccount) {
        setValue(name, selectedAccount.requisite.id);
        setSelectedAccount?.(selectedAccount);
      }
    }
  }, [selectedAccountNumber, allAccounts]);

  return (
    <div className="flex flex-col gap-4">
      {title ? (
        <span className="text-24-medium text-typography-primary">{title}</span>
      ) : null}
      <FormField
        name={name}
        control={control}
        render={({ field }) => {
          const selectedAccount = allAccounts.find(
            (account) => account.requisite.id === field.value
          );
          setSelectedAccount?.(selectedAccount);
          return (
            <FormItem>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    if (value && value !== field.value) {
                      field.onChange(value);

                      const currentCurrency = allAccounts.find(
                        (account) => account.requisite.id === value
                      )?.currency;
                      if (setCurrency) {
                        setCurrency(currentCurrency as AccountCurrencyCode);
                      }
                    }
                  }}
                  onOpenChange={(v: boolean) => setOpen(v)}
                  open={open}
                >
                  <SelectTrigger
                    className={`h-18 w-full cursor-pointer border-0 bg-fill-primary py-2 pl-2 pr-4 ${open ? "rounded-b-none rounded-t-3xl" : "rounded-3xl"}`}
                    aria-label={t("common.buttonText.selectAccountToTransfer")}
                  >
                    {selectedAccount?.id ? (
                      <div className="flex w-full items-center justify-between gap-2">
                        <AccountSelectItem
                          amount={selectedAccount.balance.currentBalance}
                          description={
                            selectedAccount.alias || selectedAccount.number
                          }
                          currencySymbol={
                            selectedAccount.currency as AccountCurrencyCode
                          }
                          icon={"24/Colored/Euro"}
                          isSelected={false}
                        />
                        <Thumbnail variant={"light"}>
                          <Icon
                            name={"24/Primary/ArrowDown"}
                            className={`mx-auto size-6 self-center text-icon-primary ${open && "-rotate-180"}`}
                          />
                        </Thumbnail>
                      </div>
                    ) : (
                      <div className="flex w-full gap-x-2">
                        <Skeleton className="size-10 rounded-lg bg-fill-primary-active" />
                        <Skeleton className="h-10 w-32 rounded-lg bg-fill-primary-active" />
                      </div>
                    )}
                  </SelectTrigger>
                  <SelectContent className="-top-1 rounded-t-none border-0 shadow-sm [&>div]:p-0">
                    {allAccounts.length
                      ? allAccounts.map((item) => (
                          <SelectItem
                            key={item.id}
                            value={item.requisite.id}
                            className="cursor-pointer p-2 focus:bg-fill-primary"
                          >
                            <AccountSelectItem
                              amount={item.balance.currentBalance}
                              description={item.alias || item.number}
                              currencySymbol={
                                item.currency as AccountCurrencyCode
                              }
                              icon={
                                currencyDesigns[
                                  item.currency as AccountCurrencyCode
                                ] as IconName
                              }
                              isSelected={field.value === item.id}
                            />
                          </SelectItem>
                        ))
                      : null}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          );
        }}
      />
    </div>
  );
}
