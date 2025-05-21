import { type FC } from "react";
import { useParams, useRouter } from "next/navigation";
import User from "@/features/payments/components/User";
import { type Transaction } from "@/features/transactions/lib/transaction";
import { type AccountCurrencyCode } from "@/types/local.types";
import { useTranslation } from "react-i18next";

import {
  convertToCurrencyObject,
  formatDateTime,
  formatIban,
  maskAccountNumber,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { resolveLabel } from "../lib/transaction-utils";

type PageProps = Transaction & {
  phoneNumber?: string;
};

export const TransactionHistoryOptionContent: FC<PageProps> = ({
  originator,
  beneficiary,
  comment,
  amount,
  currency,
  counterPartyName,
  counterPartyType,
  icon,
  type,
  isWithinOwnAccounts,
  isOutgoingOperation,
  contact,
  date,
  commission,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = useParams();
  const { locale } = pathname;
  const amountData = convertToCurrencyObject(
    amount,
    currency as AccountCurrencyCode,
    1
  );

  const originatorIban = originator.paymentRequisites
    ? originator?.paymentRequisites[0]?.iban
    : undefined;
  const beneficiaryIban = beneficiary.paymentRequisites
    ? beneficiary?.paymentRequisites[0]?.iban
    : undefined;

  const counterPartyIban = isOutgoingOperation
    ? beneficiaryIban
    : originatorIban;
  const counterPartyPhone = isOutgoingOperation
    ? beneficiary.phone
    : originator.phone;
  const counterPartyEmail = isOutgoingOperation
    ? beneficiary.email
    : originator.email;

  const finalAmount = isOutgoingOperation
    ? `-${amountData.base}`
    : `+${amountData.base}`;

  const addContact = () => {
    const country = counterPartyIban.slice(0, 2);
    const query = {
      country,
      currency: currency ?? "EUR",
      accountNumber: counterPartyIban,
      name: counterPartyName,
      type: counterPartyType.toUpperCase(),
    };
    const queryString = new URLSearchParams(query).toString();
    router.push(`/private/contacts/new-contact?${queryString}`);
  };

  const originatorBank = originator?.paymentRequisites?.[0].institution;
  const beneficiaryBank = beneficiary?.paymentRequisites?.[0].institution;

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-5 pt-6">
          <User
            avatar={icon ?? ""}
            name={counterPartyName}
            status={""}
            size={"small"}
            type={type}
            isWithinOwnAccounts={isWithinOwnAccounts}
            showLabel={false}
            isCustomer={!beneficiary.external}
            avatarSize={"L"}
            avatarStatusSize={"M"}
          />
          <div>
            <p className="mb-2 text-center text-24-medium text-typography-primary">
              {counterPartyName}
            </p>
            <p className="text-center text-16-medium text-typography-primary">
              {counterPartyPhone ?? counterPartyEmail}
            </p>
          </div>
        </div>
        {!isOutgoingOperation && !contact && (
          <Button
            variant={"secondary-success"}
            className="w-fit self-center"
            onClick={addContact}
          >
            {t("transactions.addContact")}
          </Button>
        )}
        <div className="rounded-3xl bg-fill-primary p-4">
          <div className="flex justify-center text-32-medium text-typography-primary">
            <span className="text-typography-primary">
              {finalAmount}
              <span className={"text-typography-secondary"}>
                ,{amountData.decimals} {amountData.currencySign}
              </span>
            </span>
          </div>
          <div className="text-center text-16-medium text-typography-primary">
            {isOutgoingOperation ? (
              <>
                {t("transactions.debitFromAccount")}{" "}
                {originatorIban ? maskAccountNumber(originatorIban) : ""}
              </>
            ) : (
              <>
                {t("transactions.creditToAccount")}{" "}
                {beneficiaryIban ? maskAccountNumber(beneficiaryIban) : ""}
              </>
            )}
          </div>
          {commission ? (
            <div className="text-center text-16-medium text-typography-secondary">
              {t("transactions.commission")}
              <span className={"text-typography-secondary"}>
                {`${commission} ${amountData.currencySign}`}
              </span>
            </div>
          ) : null}
        </div>
        <div className=" rounded-3xl bg-fill-primary p-4">
          <div className="mb-4">
            <p className="mb-1 text-12-medium text-typography-secondary">
              {t("payments.success.transactionDate")}
            </p>
            <p className="text-16-medium text-typography-primary">
              {formatDateTime(date, locale)}
            </p>
          </div>
          <div>
            <p className="mb-1 text-12-medium text-typography-secondary">
              {t("transactions.transactionTypes.transactionType")}
            </p>
            <p className="text-16-medium text-typography-primary">
              {resolveLabel(type, t)}
            </p>
          </div>
        </div>

        <div>
          <div className="rounded-3xl bg-fill-primary p-4">
            {(originatorBank || beneficiaryBank) && (
              <div className="mb-4">
                <p className="mb-1 text-12-medium text-typography-secondary">
                  {t("transactions.bank")}
                </p>
                <p className="text-16-medium text-typography-primary">
                  {isOutgoingOperation ? beneficiaryBank : originatorBank}
                </p>
              </div>
            )}
            <div>
              {counterPartyIban ? (
                <>
                  {isOutgoingOperation ? (
                    <div>
                      <p className="mb-1 text-12-medium text-typography-secondary">
                        {t("transactions.recipientIban")}
                      </p>
                      <p className="text-16-medium text-typography-primary">
                        {formatIban(beneficiaryIban)}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-1 text-12-medium text-typography-secondary">
                        {t("transactions.senderIban")}
                      </p>
                      <p className="text-16-medium text-typography-primary">
                        {formatIban(originatorIban)}
                      </p>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-fill-primary p-4">
          <div>
            {comment && (
              <div>
                <p className="mb-1 text-12-medium text-typography-secondary">
                  {t("payments.requestMoney.explanation")}
                </p>
                <p className="text-16-medium text-typography-primary">
                  {comment}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
