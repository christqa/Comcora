"use client";

import { api } from "@/features/trpc-client/hooks/react";

export const usePayments = () => {
  const utils = api.useUtils();
  const { mutateAsync: createPayment } = api.payments.createPayment.useMutation(
    {
      onSuccess: () => utils.transaction.getTransactions.invalidate(),
    }
  );
  return {
    createPayment,
  };
};
