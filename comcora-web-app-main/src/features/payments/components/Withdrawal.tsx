"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useConfirmation,
  type ConfirmationInit,
} from "@/features/confirmation/hooks/ConfirmationContext";
import { type AccountCurrencyCode } from "@/types/local.types";
import { type PaymentOrderRequestDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import { type FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { resolveCurrencySign } from "@/lib/utils";
import AutoGrowInput from "@/components/ui/autoGrowInput";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  useFormField,
} from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { SectionTitle } from "@/components/ui/SectionTitle";

import { usePayments } from "../hooks/usePayments";

interface WithdrawalProps {
  link?: string;
  currency?: string;
  context?: string;
  numericValue?: number;
  setNumericValue?: (value: number) => void;
  isEnoughBalance?: boolean;
  isEnoughBalanceHandler?: () => void;
}

export default function Withdrawal({
  link,
  currency,
  numericValue,
  setNumericValue,
  isEnoughBalance,
  isEnoughBalanceHandler,
  context,
}: WithdrawalProps) {
  const { t } = useTranslation();
  const { control, formState, handleSubmit, watch } = useFormField();
  const router = useRouter();
  const { createPayment } = usePayments();
  const [loading, setLoading] = useState(false);
  const { confirm } = useConfirmation();
  const { originatorRequisiteId, beneficiaryRequisiteId } = watch();

  const isDisabled = originatorRequisiteId === beneficiaryRequisiteId;

  const handleOpenDialog = async () => {
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

  const onSubmit = async (values: FieldValues) => {
    const success = await handleOpenDialog();

    if (success) {
      const order = await createPayment({
        ...values,
      } as PaymentOrderRequestDTO);
      router.push(link ?? `/private/payments/success?paymentId=${order.id}`);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    isEnoughBalanceHandler?.();
  }, [numericValue]);

  const isBetweenAccounts = context === "betweenAccounts";
  const hasValidAmount = numericValue && numericValue > 0;

  const showInsufficientFunds =
    isEnoughBalance && !isBetweenAccounts
      ? true
      : !!(isBetweenAccounts && isEnoughBalance && hasValidAmount);

  return (
    <div className="relative z-10 flex flex-col">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-fill-surface-inverse/80">
          <Icon
            className={"size-9 animate-spin"}
            name={"40/Accent/Preloader"}
          />
        </div>
      )}
      <p className="text-24-medium text-typography-primary">
        {t("payments.betweenAccounts.writeOffAmount")}
      </p>
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <div className="flex items-center text-32-medium text-typography-primary">
            <FormField
              control={control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AutoGrowInput
                      value={field.value}
                      handleChange={(value: string) => {
                        const newValue = Math.max(0, Number(value));
                        setNumericValue?.(newValue);
                        field.onChange(newValue);
                      }}
                      color={"primary"}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <span className={"ml-1 text-typography-secondary"}>
              {resolveCurrencySign(currency as AccountCurrencyCode)}
            </span>
          </div>

          <SectionTitle>
            {showInsufficientFunds
              ? t("payments.betweenAccounts.insufficientFunds")
              : t("payments.betweenAccounts.instantCreditingNoCommission")}
          </SectionTitle>
        </div>
        <Button
          variant="accent"
          size="L"
          onClick={handleSubmit(onSubmit)}
          aria-label={t("common.buttonText.transfer")}
          type={"submit"}
          disabled={
            formState.isSubmitting ||
            !formState.isValid ||
            isDisabled ||
            isEnoughBalance
          }
        >
          {t("common.buttonText.transfer")}
        </Button>
      </div>
    </div>
  );
}
