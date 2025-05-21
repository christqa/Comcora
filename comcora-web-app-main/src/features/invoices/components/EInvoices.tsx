import { useMemo } from "react";
import AllInvoicesWidget from "@/features/invoices/components/AllInvoicesWidget";
import SearchFilter from "@/features/invoices/components/SearchFilter";
import WaitingPaymentWidget from "@/features/invoices/components/WaitingPaymentWidget";
import { type TFunction } from "i18next";
import { useTranslation } from "react-i18next";

const getPaymentMethodFilters = (t: TFunction) => [
  { value: "manualPayment", name: t("einvoices.filters.manualPayment") },
  { value: "automaticPayment", name: t("einvoices.filters.autoCharge") },
];

export default function EInvoices() {
  const { t } = useTranslation();
  const paymentMethodFilters = useMemo(() => getPaymentMethodFilters(t), [t]);
  return (
    <div className="flex flex-col gap-10">
      <SearchFilter filters={paymentMethodFilters} />
      <WaitingPaymentWidget />
      <AllInvoicesWidget />
    </div>
  );
}
