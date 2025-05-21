import { useRouter } from "next/navigation";
import { type ContactPaymentRequisiteViewDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import { useTranslation } from "react-i18next";

import { COUNTRIES } from "@/lib/countries";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

interface RequisiteDetailsProps {
  open: boolean;
  onClose: () => void;
  paymentRequisite: ContactPaymentRequisiteViewDTO;
  contactId: string;
  context?: string;
}

const getCountryName = (code: string) => {
  return COUNTRIES.find((country) => country.value === code)?.label;
};

const RequisiteDetailsSheet = (props: RequisiteDetailsProps) => {
  const { open, onClose, paymentRequisite, contactId, context } = props;
  const { t } = useTranslation();
  const router = useRouter();

  const handleCopy = () => {
    if (!paymentRequisite) {
      return;
    }

    void navigator.clipboard
      .writeText(
        [
          `${t("common.credentials.country")}: ${getCountryName(paymentRequisite.country)}
          ${t("common.credentials.currency")}: ${paymentRequisite.currency}
          ${t("common.credentials.bankName")}: ${paymentRequisite.financialInstitutionName}
          ${t("common.credentials.accountNumber")}: ${paymentRequisite.accountNumber}
          ${t("common.credentials.recipient")}: ${paymentRequisite.name}`,
        ].join("\n")
      )
      .then(() => {
        toast({
          title: t("accounts.messages.dataCopied"),
        });
      });
  };

  const handleCopyAccountNumber = () => {
    if (!paymentRequisite) {
      return;
    }

    void navigator.clipboard
      .writeText(paymentRequisite.accountNumber)
      .then(() => {
        toast({
          title: t("accounts.messages.accountNumberCopied"),
        });
      });
  };

  const handleCopyRecipient = () => {
    if (!paymentRequisite) {
      return;
    }

    void navigator.clipboard.writeText(paymentRequisite.name).then(() => {
      toast({
        title: t("accounts.messages.recipientCopied"),
      });
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="flex h-full flex-col">
        <SheetHeader className="flex-none pb-[10px]">
          <SheetTitle>{t("payments.accountDetails.title")}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-6 rounded-3xl">
          {paymentRequisite.id ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 text-typography-primary">
                <span className={"text-14-medium text-typography-secondary"}>
                  {t("common.credentials.country")}
                </span>
                <span className={"text-16-semibold"}>
                  {getCountryName(paymentRequisite.country)}
                </span>
              </div>
              <div className="flex flex-col gap-2 text-typography-primary">
                <span className={"text-14-medium text-typography-secondary"}>
                  {t("common.credentials.currency")}
                </span>
                <span className={"text-16-semibold"}>
                  {paymentRequisite.currency}
                </span>
              </div>
              <div className="flex flex-col gap-2 text-typography-primary">
                <span className={"text-14-medium text-typography-secondary"}>
                  {t("common.credentials.bankName")}
                </span>
                <span className={"text-16-semibold"}>
                  {paymentRequisite.financialInstitutionName}
                </span>
              </div>
              <div className="flex flex-col gap-2 text-typography-primary">
                <span className={"text-14-medium text-typography-secondary"}>
                  {t("common.credentials.accountNumber")}
                </span>
                <div className="flex items-center justify-between">
                  <span className={"text-16-semibold"}>
                    {paymentRequisite.accountNumber}
                  </span>
                  <Button
                    size={"icon"}
                    color={"transparent"}
                    className={"size-auto bg-transparent hover:bg-transparent"}
                    onClick={handleCopyAccountNumber}
                  >
                    <Icon
                      name={"16/Primary/Copy"}
                      className={"size-4 text-typography-secondary"}
                    />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-typography-primary">
                <span className={"text-14-medium text-typography-secondary"}>
                  {t("common.credentials.recipient")}
                </span>
                <div className="flex items-center justify-between">
                  <span className={"text-16-semibold"}>
                    {paymentRequisite.name}
                  </span>
                  <Button
                    size={"icon"}
                    color={"transparent"}
                    className={"size-auto bg-transparent hover:bg-transparent"}
                    onClick={handleCopyRecipient}
                  >
                    <Icon
                      name={"16/Primary/Copy"}
                      className={"size-4 text-typography-secondary"}
                    />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 text-typography-primary">
                <Skeleton className="h-6 w-1/4 rounded-lg bg-fill-primary-active" />
                <Skeleton className="h-6 w-full rounded-lg bg-fill-primary-active" />
              </div>
              <div className="flex flex-col gap-2 text-typography-primary">
                <Skeleton className="h-6 w-1/4 rounded-lg bg-fill-primary-active" />
                <Skeleton className="h-6 w-full rounded-lg bg-fill-primary-active" />
              </div>
              <div className="flex flex-col gap-2 text-typography-primary">
                <Skeleton className="h-6 w-1/4 rounded-lg bg-fill-primary-active" />
                <Skeleton className="h-6 w-full rounded-lg bg-fill-primary-active" />
              </div>
              <div className="flex flex-col gap-2 text-typography-primary">
                <Skeleton className="h-6 w-1/4 rounded-lg bg-fill-primary-active" />
                <Skeleton className="h-6 w-full rounded-lg bg-fill-primary-active" />
              </div>
              <div className="flex flex-col gap-2 text-typography-primary">
                <Skeleton className="h-6 w-1/4 rounded-lg bg-fill-primary-active" />
                <Skeleton className="h-6 w-full rounded-lg bg-fill-primary-active" />
              </div>
            </div>
          )}
        </div>
        <SheetFooter>
          <div className="flex flex-col gap-4 bg-fill-background-main">
            <Button
              onClick={handleCopy}
              className="w-full"
              size={"L"}
              variant={"secondary-success"}
            >
              {t("contacts.account.copyDetails")}
            </Button>
            {context !== "payments" && (
              <Button
                onClick={() =>
                  router.push(
                    `/private/payments/new-payment?userId=${contactId}&requisiteId=${paymentRequisite?.id}`
                  )
                }
                className="w-full"
                size={"L"}
              >
                {t("common.buttonText.transfer")}
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default RequisiteDetailsSheet;
