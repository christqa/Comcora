import React, { type PropsWithChildren } from "react";
import { type Transaction } from "@/features/transactions/lib/transaction";

import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/icon";
import { Thumbnail } from "@/components/ui/thumbnail";

type TransactionAvatarProps = Pick<
  Transaction,
  | "type"
  | "counterPartyType"
  | "counterPartyImageUri"
  | "counterPartyName"
  | "isWithinOwnAccounts"
  | "isCustomer"
>;

export default function TransactionAvatar(
  props: PropsWithChildren<TransactionAvatarProps>
) {
  const {
    type,
    counterPartyName,
    counterPartyImageUri,
    isWithinOwnAccounts,
    isCustomer,
  } = props;

  return (
    <Thumbnail variant={"light"} className="overflow-visible">
      {isWithinOwnAccounts ? (
        <Icon name={"24/Primary/RoundAltArrowHalf"} />
      ) : type === "AtmWithdrawal" ? (
        <Icon name={"24/Primary/CashOut"} />
      ) : (
        <Avatar
          src={counterPartyImageUri}
          alt={counterPartyName}
          size="M"
          showBadge={isCustomer}
          statusSize="S"
        />
      )}
    </Thumbnail>
  );
}
