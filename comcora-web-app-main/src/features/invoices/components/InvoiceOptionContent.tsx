import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Thumbnail } from "@/components/ui/thumbnail";

export const InvoiceOptionContent = () => {
  const { t } = useTranslation();
  return (
    <div className="flex grow flex-col gap-6 rounded-3xl bg-fill-primary p-4">
      <div>
        <span className="text-12-medium text-typography-secondary">
          {t("einvoices.agreements.constantPaymentAgreement")}
        </span>
        <Button
          variant="transparent"
          className="size-fit p-0 text-16-medium text-typography-success"
        >
          {t("einvoices.agreements.seeAgreement")}
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-12-medium text-typography-secondary">
            {t("einvoices.agreements.constantPaymentAgreement")}
          </span>
          <p className="text-16-medium text-typography-primary">43879555</p>
        </div>
        <Thumbnail variant="light">
          <Icon
            name="24/Primary/DownloadPDF"
            className="text-typography-success"
          />
        </Thumbnail>
      </div>
      <div>
        <span className="text-12-medium text-typography-secondary">
          {t("einvoices.invoices.dateOfReceival")}
        </span>
        <div className="text-16-medium text-typography-primary">26.06.2025</div>
      </div>
      <div>
        <span className="text-12-medium text-typography-secondary">
          {t("einvoices.invoices.buyerName")}
        </span>
        <div className="text-16-medium text-typography-primary">
          Konstantin Konstantinopolskij
        </div>
      </div>
      <div>
        <span className="text-12-medium text-typography-secondary">
          {t("einvoices.agreements.buyerIban")}
        </span>
        <div className="text-16-medium text-typography-primary">
          EE00 6547 8754 9874 3456
        </div>
      </div>
      <div>
        <span className="text-12-medium text-typography-secondary">
          {t("einvoices.agreements.invoiceSender")}
        </span>
        <div className="text-16-medium text-typography-primary">
          COMCORA LIFE INSURANCE SE
        </div>
      </div>
      <div>
        <span className="text-12-medium text-typography-secondary">
          {t("einvoices.agreements.senderIban")}
        </span>
        <div className="text-16-medium text-typography-primary">
          EE00 6500 8976 0293 0092
        </div>
      </div>
      <div>
        <span className="text-12-medium text-typography-secondary">
          {t("einvoices.agreements.paymentTotal")}
        </span>
        <div className="text-16-medium text-typography-primary">300,00 €</div>
      </div>
      <div>
        <span className="text-12-medium text-typography-secondary">
          {t("einvoices.referenceNumber")}
        </span>
        <div className="text-16-medium text-typography-primary">0987634334</div>
      </div>
      <div>
        <span className="text-12-medium text-typography-secondary">
          {t("einvoices.details")}
        </span>
        <div className="text-16-medium text-typography-primary">
          {t("einvoices.invoices.insurancePayment")}
        </div>
      </div>
      <div>
        <span className="text-12-medium text-typography-secondary">
          {t("einvoices.paymentDue")}
        </span>
        <div className="text-16-medium text-typography-primary">30.06.2025</div>
      </div>
    </div>
  );
};
