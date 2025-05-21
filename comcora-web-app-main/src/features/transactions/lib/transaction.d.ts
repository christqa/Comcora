import { type TransactionStatus } from "@/features/transactions/lib/transaction-utils";
import {
  type BankContact,
  type PaymentRequisite,
} from "@features/contacts/lib/contact";
import { type TransactionSource } from "@features/transactions/lib/transaction-utils";
import { type ContactDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import {
  type EnrichedFinancialOperationDTO,
  type EnrichedFinancialOperationTypeDTO,
} from "@xdatagroup/tbb-sdk/dist/api/services/business/models/EnrichedFinancialOperationDTO";

export type Transaction = {
  id: string;
  date: string;
  source: TransactionSource;
  amount: number | undefined;
  currency: string | undefined;

  direction: TransactionDirection;
  counterPartyType: TransactionCounterPartyType;
  counterPartyName: string;
  counterPartyImageUri?: string;
  commission?: string;
  comment: string;
  attachment: string;
  accountId: string;
  status: TransactionStatus;
  type: EnrichedFinancialOperationTypeDTO;
  isWithinOwnAccounts: boolean;
  isOutgoingOperation: boolean;
  icon?: string;
  isCustomer?: boolean;
  beneficiary: BankContact;
  originator: BankContact;
  internalData?: {
    from: PaymentRequisite;
    to: PaymentRequisite;
  };
  contact?: ContactDTO;
  accountAlias?: string;
  _orig?: EnrichedFinancialOperationDTO;
};

export type TransactionDirection = "debit" | "credit";
export type TransactionCounterPartyType = "person" | "company";
export type LocalTransactionType = "payments" | "transfers" | "internal";
