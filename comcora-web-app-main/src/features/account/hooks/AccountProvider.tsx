"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useAuth } from "@/features/login/hooks/AuthContext";
import { api } from "@/features/trpc-client/hooks/react";
import {
  type AccountSummaryDTO,
  type CardChangeRequestCardStateDTO,
} from "@xdatagroup/tbb-sdk/dist/api/services/business/models";

type AccountProviderProps = {
  accountId: string;
  cardId?: string;
};

type AccountProviderHooks = {
  account?: AccountSummaryDTO;
  renameAccount: (name: string) => Promise<unknown>;
  renameCard: (name: string) => Promise<unknown>;
  closeAccount: (data: {
    accountToClose: string;
    accountToTransfer: string;
  }) => Promise<unknown>;
  updateCardState: (state: CardChangeRequestCardStateDTO) => Promise<unknown>;
  refetch: () => Promise<unknown>;
};

const AccountContext = createContext<AccountProviderHooks>({
  account: undefined,
  renameAccount: () => Promise.resolve(undefined),
  renameCard: () => Promise.resolve(undefined),
  closeAccount: () => Promise.resolve(undefined),
  updateCardState: () => Promise.resolve(undefined),
  refetch: () => Promise.resolve(undefined),
});

export const useAccount = () => useContext(AccountContext);

export function AccountProvider(
  props: PropsWithChildren<AccountProviderProps>
) {
  const { encryptedAccessPin } = useAuth();
  const { accountId, children, cardId } = props;

  const { data: initialAccount, refetch } =
    api.account.getAccountSummary.useQuery(
      {
        id: accountId,
      },
      {
        enabled: Boolean(encryptedAccessPin),
      }
    );

  const { mutateAsync: updateAccountAlias } =
    api.account.updateAlias.useMutation();

  const { mutateAsync: updateCardAlias } =
    api.account.setCardAlias.useMutation();

  const { mutateAsync: updateCard } = api.account.updateCard.useMutation();

  const [account, setAccount] = useState(initialAccount);

  useEffect(() => {
    setAccount(initialAccount);
  }, [initialAccount]);

  const renameAccount = useCallback(
    (name: string) => {
      const updatedAccount = { ...account!, alias: name };
      setAccount(updatedAccount);
      return updateAccountAlias({
        alias: name,
        accountId: updatedAccount.id,
      });
    },
    [account]
  );

  const renameCard = useCallback(
    (name: string) => {
      const updatedCards =
        account?.cards.map((card) => ({
          ...card,
          alias: cardId === card.id ? name : card.alias,
        })) ?? [];

      setAccount({
        ...account!,
        cards: updatedCards,
      });

      return updateCardAlias({
        alias: name,
        cardId: cardId ?? "",
      });
    },
    [account, cardId]
  );

  const closeAccount = useCallback(
    (data: { accountToClose: string; accountToTransfer: string }) => {
      return Promise.reject("NOT IMPLEMENTED");
    },
    []
  );

  const updateCardState = useCallback(
    (state: CardChangeRequestCardStateDTO) => {
      if (!cardId) {
        return Promise.resolve(undefined);
      }

      return updateCard({
        cardId,
        state,
      });
    },
    [cardId, updateCard]
  );

  return (
    <AccountContext.Provider
      value={{
        account,
        renameAccount,
        renameCard,
        closeAccount,
        updateCardState,
        refetch,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
