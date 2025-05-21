import { useTranslation } from "react-i18next";

import { mockInvoice } from "@/lib/mock-data";
import { ListOption } from "@/components/ui/list-option";
import { Thumbnail } from "@/components/ui/thumbnail";

export const InvoiceBeneficiaryContent = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <ListOption>
        <Thumbnail variant="light"></Thumbnail>
        <div className="flex flex-col gap-x-4">
          <span className="grow text-left text-16-semibold text-typography-primary">
            {mockInvoice.beneficiary.name}
          </span>
          <span className="text-left text-12-medium text-typography-secondary">
            {mockInvoice.beneficiary.accountNumber}
          </span>
        </div>
      </ListOption>
      <div className="rounded-2xl bg-fill-primary px-4 py-2">
        <div className="flex flex-col gap-1">
          <span className="text-12-medium text-typography-disabled">
            {t("einvoices.referenceNumber")}
          </span>
          <span className="text-16-medium text-typography-disabled">
            {mockInvoice.beneficiary.linkNumber}
          </span>
        </div>
      </div>
      <div className="rounded-2xl bg-fill-primary px-4 py-2">
        <div className="flex flex-col gap-1">
          <span className="text-12-medium text-typography-disabled">
            {t("einvoices.description")}
          </span>
          <span className="text-16-medium text-typography-disabled">
            {mockInvoice.beneficiary.description}
          </span>
        </div>
      </div>
    </div>
  );
};
