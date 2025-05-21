import { useMemo } from "react";
import AgreementsWidget from "@/features/invoices/components/AgreementsWidget";
import SearchFilter from "@/features/invoices/components/SearchFilter";
import { type TFunction } from "i18next";
import { useTranslation } from "react-i18next";

const getAgreementFilters = (t: TFunction) => [
  { value: "regular", name: t("einvoices.filters.regular") },
  { value: "nonRegular", name: t("einvoices.filters.regular") },
];

export default function Agreements() {
  const { t } = useTranslation();
  const agreementFilters = useMemo(() => getAgreementFilters(t), [t]);
  return (
    <div className="flex flex-col gap-10">
      <SearchFilter filters={agreementFilters} />
      <AgreementsWidget />
    </div>
  );
}
