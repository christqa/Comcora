"use client";

import { useState, type FC } from "react";
import { useRouter } from "next/navigation";
import AgreementOption, {
  type AgreementType,
} from "@/features/invoices/components/AgreementOption";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { WithSheet } from "@/components/ui/WithSheet";

import { AgreementOptionContent } from "./AgreementOptionContent";
import DeleteModal from "./DeleteModal";

const agreements: AgreementType[] = [
  {
    id: 1,
    name: "ERGO Insurance SE",
    invoiceName: "Страхование",
    status: "active",
    date: "10.05.2025",
    time: "13:45",
  },
  {
    id: 2,
    name: "24-FITNESSKLUBI OÜ",
    invoiceName: "Спорт",
    status: "active",
    date: "08.05.2025",
    time: "12:06",
  },
  {
    id: 3,
    name: "Telia Eesti AS",
    invoiceName: "Мобильные услуги",
    status: "completed",
    date: "05.05.2025",
    time: "14:57",
  },
];

type AgreementActionsProps = {
  onAgreementEdit: () => void;
  onAgreementFinish: () => void;
};

const AgreementActions: FC<AgreementActionsProps> = ({
  onAgreementEdit,
  onAgreementFinish,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4 pt-6">
      <Button
        onClick={onAgreementEdit}
        className={"h-14 w-full"}
        variant={"secondary-success"}
        size="L"
      >
        {t("einvoices.agreements.editAgreement")}
      </Button>
      <Button
        className={"h-14 w-full"}
        variant={"secondary-critical"}
        size="L"
        onClick={onAgreementFinish}
      >
        {t("einvoices.agreements.endAgreement")}
      </Button>
    </div>
  );
};

export default function AgreementsWidget() {
  const { t } = useTranslation();
  const router = useRouter();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openInvoiceId, setOpenInvoiceId] = useState<number>();

  return (
    <div className="flex w-[41rem] flex-col items-center gap-y-4">
      <div className="flex w-full flex-col rounded-3xl bg-fill-primary">
        {agreements.map((item) => (
          <WithSheet
            key={item.id}
            open={openInvoiceId === item.id}
            onClose={() => setOpenInvoiceId(undefined)}
            trigger={
              <div onClick={() => setOpenInvoiceId(item.id)}>
                <AgreementOption
                  date={item.date}
                  name={item.name}
                  invoiceName={item.invoiceName}
                  status={item.status}
                  time={item.time}
                  thumbnail={<Icon name="24/Primary/Documents" />}
                />
              </div>
            }
            title={t("einvoices.agreements.constantPaymentAgreement")}
            actionButtons={
              <AgreementActions
                onAgreementEdit={() =>
                  router.push("/private/invoices/agreement/1")
                }
                onAgreementFinish={() => setOpenDeleteModal(true)}
              />
            }
          >
            <AgreementOptionContent />
          </WithSheet>
        ))}
      </div>
      <DeleteModal
        onDelete={() => {
          setOpenDeleteModal(false);
          setOpenInvoiceId(undefined);
        }}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        description={t("einvoices.agreements.endAgreementInfo")}
        btnText={t("einvoices.agreements.endAgreement")}
      />
    </div>
  );
}
