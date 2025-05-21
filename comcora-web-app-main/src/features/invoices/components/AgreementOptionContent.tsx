import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { Icon } from "@/components/ui/icon";
import { Thumbnail } from "@/components/ui/thumbnail";

export const AgreementOptionContent = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="mb-2 flex grow flex-col gap-6 rounded-3xl bg-fill-primary p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-12-medium text-typography-secondary">
              {t("einvoices.agreements.documentNumber")}
            </span>
            <div className="text-16-medium text-typography-primary">
              TB090807
            </div>
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
            {t("einvoices.agreements.invoiceSender")}
          </span>
          <div className="text-16-medium text-typography-primary">
            COMCORA LIFE INSURANCE SE
          </div>
        </div>
        <div>
          <span className="text-12-medium text-typography-secondary">
            {t("einvoices.agreements.senderRegistrationNumber")}
          </span>
          <div className="text-16-medium text-typography-primary">43879555</div>
        </div>
        <div>
          <span className="text-12-medium text-typography-secondary">
            {t("einvoices.agreements.invoicePaymentIban")}
          </span>
          <div className="text-16-medium text-typography-primary">
            EE00 6500 8976 0293 0092
          </div>
        </div>
        <div>
          <span className="text-12-medium text-typography-secondary">
            {t("einvoices.agreements.buyer")}
          </span>
          <div className="text-16-medium text-typography-primary">
            Roman Konstantinopoli
          </div>
        </div>
        <div>
          <span className="text-12-medium text-typography-secondary">
            {t("einvoices.agreements.buyerRegistrationNumber")}
          </span>
          <div className="text-16-medium text-typography-primary">98003320</div>
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
            {t("einvoices.agreements.activeFrom")}
          </span>
          <div className="text-16-medium text-typography-primary">
            26.06.2025
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
            {t("einvoices.agreements.partialDebit")}
          </span>
          <div className="text-16-medium text-typography-primary">Нет</div>
        </div>
        <div>
          <span className="text-12-medium text-typography-secondary">
            {t("einvoices.agreements.partialDebit")}
          </span>
          <div className="text-16-medium text-typography-primary">Нет</div>
        </div>
        <div className="flex flex-col">
          <span className="text-12-medium text-typography-secondary">
            {t("einvoices.agreements.paymentsHistory")}
          </span>
          <Button
            variant="transparent"
            className="size-fit p-0 text-16-medium text-typography-success"
          >
            {t("common.buttonText.see")}
          </Button>
        </div>
        <div className="flex flex-col">
          <span className="text-12-medium text-typography-secondary">
            {t("einvoices.agreements.autoPaymentAgreementHistory")}
          </span>
          <Button
            variant="transparent"
            className="size-fit p-0 text-16-medium text-typography-success"
          >
            {t("common.buttonText.see")}
          </Button>
        </div>
      </div>
      <CollapsibleSection
        titleClassname="text-14-medium"
        title="Контактные данные отправителя"
      >
        <div className="flex grow flex-col gap-6 rounded-3xl bg-fill-primary p-4">
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
              {t("einvoices.agreements.senderRegistrationNumber")}
            </span>
            <div className="text-16-medium text-typography-primary">
              43879555
            </div>
          </div>
          <div>
            <span className="text-12-medium text-typography-secondary">
              {t("einvoices.agreements.invoicePaymentIban")}
            </span>
            <div className="text-16-medium text-typography-primary">
              EE00 6500 8976 0293 0092
            </div>
          </div>
          <div>
            <span className="text-12-medium text-typography-secondary">
              {t("einvoices.agreements.buyer")}
            </span>
            <div className="text-16-medium text-typography-primary">
              Roman Konstantinopoli
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </>
  );
};
