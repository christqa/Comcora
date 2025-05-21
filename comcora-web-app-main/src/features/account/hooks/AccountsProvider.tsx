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
import { skipToken } from "@tanstack/react-query";
import { type AccountSummaryDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import { useLocalStorage } from "usehooks-ts";

type AccountsProviderHooks = {
  privateAccounts: AccountSummaryDTO[];
  savingsAccounts: AccountSummaryDTO[];
  multiCurrencyAccounts: AccountSummaryDTO[];
  total: number;
  isFetched?: boolean;
  accountsHidden?: boolean;
  setAccountsHidden: (hidden: boolean) => void;
  isAccountHidden: (id: string) => boolean;
  setAccountHidden: (id: string, visible: boolean) => void;
};

const AccountContext = createContext<AccountsProviderHooks>({
  privateAccounts: [],
  savingsAccounts: [],
  multiCurrencyAccounts: [],
  total: 0,
  isFetched: false,
  accountsHidden: false,
  setAccountsHidden: () => void 0,
  isAccountHidden: () => false,
  setAccountHidden: () => void 0,
});

export const useAccounts = () => useContext(AccountContext);

export function AccountsProvider(props: PropsWithChildren) {
  const { children } = props;
  const { encryptedAccessPin } = useAuth();

  const { data: summary, isFetched } = api.account.getAccountsSummary.useQuery(
    Boolean(encryptedAccessPin) ? undefined : skipToken
  );

  const [privateAccounts, setPrivateAccounts] = useState<
    Array<AccountSummaryDTO>
  >([]);
  const [savingsAccounts, setSavingsAccounts] = useState<
    Array<AccountSummaryDTO>
  >([]);
  const [multiCurrencyAccounts, setMultiCurrencyAccounts] = useState<
    Array<AccountSummaryDTO>
  >([]);
  const [total, setTotal] = useState<number>(0);
  const [accountsHidden, setAccountsHiddenState] = useLocalStorage(
    "accounts-hidden",
    false,
    { initializeWithValue: false }
  );
  const [accountVisibility, setAccountVisibility] = useLocalStorage<
    { id: string; visible: boolean }[]
  >("account-visibility", [], { initializeWithValue: false });

  useEffect(() => {
    if (!summary) {
      return;
    }
    const localPrivateAccounts: Array<AccountSummaryDTO> = [];
    const localSavingsAccounts: Array<AccountSummaryDTO> = [];
    const localMultiCurrencyAccounts: Array<AccountSummaryDTO> = [];
    let localTotal = 0;

    summary.forEach((account: AccountSummaryDTO) => {
      const currencies: Array<string> = [];

      currencies.push(account.currency);

      if (currencies.length > 1) {
        localMultiCurrencyAccounts.push(account);
      } else {
        localPrivateAccounts.push(account);
      }
      localTotal += Number(account.balance.availableBalanceEur || 0);
    });
    setTotal(localTotal);
    setPrivateAccounts(localPrivateAccounts);
    setSavingsAccounts(localSavingsAccounts);
    setMultiCurrencyAccounts(localMultiCurrencyAccounts);
  }, [summary]);

  const isAccountHidden = useCallback(
    (id: string) => {
      const account = accountVisibility.find((acc) => acc.id === id);
      return account ? !account.visible : accountsHidden;
    },
    [accountVisibility, accountsHidden]
  );

  const setAccountsHidden = useCallback(
    (hidden: boolean) => {
      setAccountsHiddenState(hidden);
      setAccountVisibility([]);
    },
    [setAccountsHiddenState, setAccountVisibility]
  );

  const setAccountHidden = useCallback(
    (id: string, hidden: boolean) => {
      const newAccountVisibility = accountVisibility.filter(
        (acc) => acc.id !== id
      );
      setAccountVisibility([...newAccountVisibility, { id, visible: !hidden }]);
      if (
        newAccountVisibility.length ===
        privateAccounts.length +
          savingsAccounts.length +
          multiCurrencyAccounts.length
      ) {
        const allHidden = newAccountVisibility.every((acc) => !acc.visible);
        const allVisible = newAccountVisibility.every((acc) => acc.visible);
        if (allHidden || allVisible) {
          setAccountsHidden(allHidden);
        }
      }
    },
    [
      accountVisibility,
      multiCurrencyAccounts.length,
      privateAccounts.length,
      savingsAccounts.length,
      setAccountVisibility,
      setAccountsHidden,
    ]
  );

  return (
    <AccountContext.Provider
      value={{
        privateAccounts,
        savingsAccounts,
        multiCurrencyAccounts,
        total,
        isFetched,
        accountsHidden,
        setAccountsHidden,
        isAccountHidden,
        setAccountHidden,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
