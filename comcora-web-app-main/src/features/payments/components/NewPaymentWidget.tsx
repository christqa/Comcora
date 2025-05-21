import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AccountsProvider } from "@/features/account/hooks/AccountsProvider";
import ConfirmationProvider from "@/features/confirmation/hooks/ConfirmationContext";
import { ContactsProvider } from "@/features/contacts/hooks/ContactsProvider";
import AccountsSelect from "@/features/invoices/components/AccountsSelect";
import ReceiverWidget from "@/features/payments/components/ReceiverWidget";
import StickerField from "@/features/payments/components/StickerField";
import Withdrawal from "@/features/payments/components/Withdrawal";
import { api } from "@/features/trpc-client/hooks/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AccountSummaryDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { ListOption } from "@/components/ui/list-option";
import { Thumbnail } from "@/components/ui/thumbnail";

const formSchema = z.object({
  originatorRequisiteId: z.string().min(1, t("common.form.fieldRequired")),
  beneficiaryRequisiteId: z.string().min(1, t("common.form.fieldRequired")),
  reference: z.string().min(1),
  amount: z.number().min(1, t("common.form.minAmount")),
  attachmentUrl: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

const NewPaymentWidget = () => {
  const { t } = useTranslation();
  const [currency, setCurrency] = useState("€");
  const [selectedAccount, setSelectedAccount] = useState<AccountSummaryDTO>();

  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const userId = searchParams.get("userId");

  const { data } = api.payments.getTransactionById.useQuery(
    { id: paymentId ?? "" },
    {
      enabled: Boolean(paymentId),
    }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const contactRequisiteId = useMemo(() => {
    return data?.contact?.paymentRequisites.find(
      (item) => item.id === data?.beneficiaryRequisiteId
    )?.id;
  }, [data]);

  const { amount } = form.watch();

  return (
    <Form {...form}>
      <form>
        <div className="flex flex-col gap-8">
          <AccountsProvider>
            <AccountsSelect
              title={t("payments.main.fromWhereToTransfer")}
              name={"originatorRequisiteId"}
              setCurrency={setCurrency}
              selectedAccountNumber={data?.originatorAccountNumber}
              setSelectedAccount={setSelectedAccount}
              selectedAccount={selectedAccount}
            />
          </AccountsProvider>
          <ContactsProvider contactId={data?.contact?.id ?? ""}>
            <ReceiverWidget requisiteId={contactRequisiteId} />
          </ContactsProvider>
          {!userId && (
            <Link href={"/private/payments/account-details"}>
              <ListOption
                containerClassName={"p-4 rounded-3xl"}
                className={"px-0"}
              >
                <Thumbnail variant="accent">
                  <Icon
                    name={"16/Primary/Plus"}
                    className="size-4 text-typography-surface-inverse"
                  />
                </Thumbnail>
                <p className="mt-2 grow text-16-semibold">
                  {t("payments.newPayment.transferByDetails")}
                </p>
              </ListOption>
            </Link>
          )}
          <StickerField />
          <ConfirmationProvider>
            <Withdrawal
              currency={currency}
              isEnoughBalance={
                selectedAccount?.balance.currentBalance
                  ? selectedAccount?.balance.currentBalance < amount
                  : false
              }
            />
          </ConfirmationProvider>
        </div>
      </form>
    </Form>
  );
};

export default NewPaymentWidget;
