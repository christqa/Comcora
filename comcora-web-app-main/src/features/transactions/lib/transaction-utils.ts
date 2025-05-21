import { type EnrichedFinancialOperationTypeDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models/EnrichedFinancialOperationDTO";
import { format, isToday, isValid, isYesterday, parseISO } from "date-fns";
import { enGB, et, ru } from "date-fns/locale";
import type { TFunction } from "i18next";

export enum TransactionStatus {
  Completed = "complete",
  Failed = "failed",
  Pending = "pending",
}

export const formatDate = (
  dateString: string,
  locale: string | string[] | undefined,
  t: TFunction
) => {
  const localeLanguage = locale === "et" ? et : locale === "ru" ? ru : enGB;

  if (!dateString) {
    return null;
  }
  const date = parseISO(dateString);

  if (isYesterday(date)) {
    return `${t("dates.yesterday")}`;
  }

  if (isToday(date)) {
    return `${t("dates.today")}`;
  }

  if (!isValid(date)) {
    return null;
  }

  if (isYesterday(date)) {
    return `${t("dates.yesterday")}`;
  }

  if (isToday(date)) {
    return `${t("dates.today")}`;
  }

  return format(date, "d MMMM", { locale: localeLanguage });
};

export const resolveLabel = (
  value: EnrichedFinancialOperationTypeDTO,
  t: TFunction
) => {
  switch (value) {
    case "IncomingTransfer":
      return t("transactions.transactionTypes.incoming");
    case "OutgoingTransfer":
      return t("transactions.transactionTypes.outgoing");
    case "AtmWithdrawal":
      return t("transactions.transactionTypes.cashWithdraw");
    case "TransferBetweenOwnAccounts":
      return t("transactions.transactionTypes.betweenOwnAccounts");
    case "CardPayment":
      return t("transactions.transactionTypes.serviceOrGoodsPayment");
    default:
      return value;
  }
};
