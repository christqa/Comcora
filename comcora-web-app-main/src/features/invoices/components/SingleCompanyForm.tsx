"use client";

import React, { useCallback, useState } from "react";
import {
  useConfirmation,
  type ConfirmationInit,
} from "@/features/confirmation/hooks/ConfirmationContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { days, paymentDay, paymentMethods } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import AutoGrowInput from "@/components/ui/autoGrowInput";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const formSchema = z.object({
  salesman: z.string().min(1),
  paymentMethod: z.string().min(1),
  paymentDay: z.string().min(1),
  day: z.string().min(1),
  invoiceName: z.string().min(1),
  limit: z.number().min(1),
});

export default function SingleCompanyForm() {
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salesman: "",
      paymentMethod: "",
      paymentDay: "",
      day: "",
      invoiceName: "",
      limit: 0,
    },
  });

  const { confirm } = useConfirmation();
  const { toast } = useToast();

  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [day, setDay] = useState("");

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
          title: t("einvoices.agreements.makeAgreementSuccessfully"),
        });
      }
    });
  };

  const handleMethodChange = useCallback(
    (method: string) => setSelectedMethod(method),
    []
  );

  const handlePaymentDayChange = useCallback(
    (paymentDay: string) => setSelectedDay(paymentDay),
    []
  );

  const handleDayChange = useCallback((day: string) => setDay(day), []);

  return (
    <Form {...form}>
      <form
        className={"flex flex-col gap-y-10"}
        onSubmit={form.handleSubmit(onSubmit)}
        action=""
      >
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="salesman"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    listItemVariant={"default"}
                    placeholder={t("einvoices.agreements.salesman")}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={handleMethodChange}
                  >
                    <SelectTrigger className="flex h-14 w-full items-center justify-between rounded-2xl border-0 border-input bg-fill-primary p-4 text-16-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-typography-secondary focus:bg-fill-secondary-active focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                      {selectedMethod ? (
                        <span>
                          {
                            paymentMethods.find(
                              (item) => item.value === selectedMethod
                            )?.label
                          }
                        </span>
                      ) : (
                        <span className="text-typography-secondary">
                          {t("einvoices.agreements.paymentMethod")}
                        </span>
                      )}
                      <Icon
                        name={"24/Primary/ArrowDown"}
                        className="size-6 text-icon-secondary"
                      />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-0 shadow-sm [&>div]:p-0">
                      {paymentMethods.map((item) => (
                        <SelectItem
                          className="flex cursor-pointer items-center justify-between rounded-none py-4 pl-6 pr-4 focus:bg-fill-primary-active"
                          key={item.id}
                          value={item.value}
                        >
                          {item.label}
                          {item.value === selectedMethod ? (
                            <Icon
                              name={"24/Primary/Check"}
                              className="size-6 text-typography-success"
                            />
                          ) : null}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="paymentDay"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={handlePaymentDayChange}
                      >
                        <SelectTrigger className="flex h-14 w-full items-center justify-between rounded-2xl border-0 border-input bg-fill-primary p-4 text-16-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-typography-secondary focus:bg-fill-secondary-active focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                          {selectedDay ? (
                            <span>
                              {
                                paymentDay.find(
                                  (item) => item.value === selectedDay
                                )?.label
                              }
                            </span>
                          ) : (
                            <span className="text-typography-secondary">
                              {t("einvoices.agreements.paymentDay")}
                            </span>
                          )}
                          <Icon
                            name={"24/Primary/ArrowDown"}
                            className="size-6 text-icon-secondary"
                          />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-0 shadow-sm [&>div]:p-0">
                          {paymentDay.map((item) => (
                            <SelectItem
                              className="flex cursor-pointer items-center justify-between rounded-none py-4 pl-6 pr-4 focus:bg-fill-primary-active"
                              key={item.id}
                              value={item.value}
                            >
                              {item.label}
                              {item.value === selectedDay ? (
                                <Icon
                                  name={"24/Primary/Check"}
                                  className="size-6 text-typography-success"
                                />
                              ) : null}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[95px]">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={handleDayChange}
                      >
                        <SelectTrigger className="flex h-14 w-full items-center justify-between rounded-2xl border-0 border-input bg-fill-primary p-4 text-16-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-typography-secondary focus:bg-fill-secondary-active focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                          {day ? (
                            <span>
                              {days.find((item) => item === Number(day))}
                            </span>
                          ) : (
                            <span className="text-typography-secondary">
                              {t("common.inputLabel.day")}
                            </span>
                          )}
                          <Icon
                            name={"24/Primary/ArrowDown"}
                            className="size-6 text-icon-secondary"
                          />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-0 shadow-sm [&>div]:p-0">
                          {days.map((item) => (
                            <SelectItem
                              className="flex cursor-pointer items-center justify-between rounded-none py-4 pl-6 pr-4 focus:bg-fill-primary-active"
                              key={item}
                              value={String(item)}
                            >
                              {item}
                              {item === Number(day) ? (
                                <Icon
                                  name={"24/Primary/Check"}
                                  className="size-6 text-typography-success"
                                />
                              ) : null}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="invoiceName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    listItemVariant={"default"}
                    placeholder={t("einvoices.title")}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-24-medium text-typography-primary">
            {t("einvoices.agreements.chargeLimit")}
          </p>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center text-32-medium text-typography-primary">
                <FormField
                  control={form.control}
                  name="limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AutoGrowInput {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span className={"ml-1 text-typography-secondary"}>€</span>
              </div>
              <SectionTitle>
                {t("einvoices.invoices.noCommission")}
              </SectionTitle>
            </div>
            <Button variant="accent" size="L" type={"submit"}>
              {t("einvoices.editAgreement")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
