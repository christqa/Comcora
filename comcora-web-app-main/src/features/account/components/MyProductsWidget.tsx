"use client";

import Link from "next/link";
import { AccountListSkeleton } from "@/features/account/components/AccountListSkeleton";
import { AccountOption } from "@/features/account/components/AccountOption";
import { useAccounts } from "@/features/account/hooks/AccountsProvider";
import { type AccountCurrencyCode } from "@/types/local.types";
import { useTranslation } from "react-i18next";

import { currencyDesigns } from "@/lib/currencies";
import { Button } from "@/components/ui/button";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { Icon, type IconName } from "@/components/ui/icon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Section } from "@/components/ui/Section";

export function MyProductsWidget() {
  const { t } = useTranslation();
  const {
    total,
    savingsAccounts,
    multiCurrencyAccounts,
    privateAccounts,
    isFetched,
    setAccountsHidden,
    accountsHidden,
  } = useAccounts();

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <span className="text-16-medium text-typography-primary">
          {t("home.products.myProducts")}
        </span>
        <Button
          variant={"transparent"}
          className={"p-0"}
          onClick={() => setAccountsHidden(!accountsHidden)}
          aria-label={
            accountsHidden
              ? t("common.buttonText.showProducts")
              : t("common.buttonText.hideProducts")
          }
        >
          <Icon
            name={accountsHidden ? "24/Primary/Eye" : "24/Primary/EyeClosed"}
            className={`size-6 ${accountsHidden ? "text-icon-primary" : "text-icon-secondary"}`}
          />
        </Button>
      </div>

      <ScrollArea maxHeight="552px">
        <div className="flex grow flex-col pb-4">
          <Section title={t("home.products.totalFunds")}>
            {!isFetched ? (
              <AccountListSkeleton />
            ) : (
              <>
                <AccountOption
                  amount={total.toFixed(2)}
                  icon={"24/Primary/Total"}
                  currencySymbol={"EUR"}
                  description={t("home.products.total")}
                  id={"all"}
                />
              </>
            )}
          </Section>
          {!isFetched ? (
            <AccountListSkeleton includeHeader={true} includeCards={true} />
          ) : (
            <>
              {savingsAccounts.length > 0 && (
                <CollapsibleSection
                  key={"savings"}
                  title={t("accounts.widget.savingsAccounts")}
                >
                  {savingsAccounts.map((acc) => (
                    <Link key={acc.id} href={"/private/accounts/" + acc.id}>
                      <AccountOption
                        amount={acc.balance.currentBalance}
                        currencySymbol={acc.currency as AccountCurrencyCode}
                        icon={
                          currencyDesigns[
                            acc.currency as AccountCurrencyCode
                          ] as IconName
                        }
                        description={acc.alias}
                        cards={acc.cards}
                        id={acc.id}
                      />
                    </Link>
                  ))}
                </CollapsibleSection>
              )}

              {privateAccounts.length > 0 && (
                <CollapsibleSection
                  key={"private"}
                  title={t("accounts.widget.personalAccounts")}
                >
                  {privateAccounts.map((acc) => (
                    <Link key={acc.id} href={"/private/accounts/" + acc.id}>
                      <AccountOption
                        key={acc.number}
                        amount={acc.balance.currentBalance}
                        currencySymbol={acc.currency as AccountCurrencyCode}
                        icon={
                          currencyDesigns[
                            acc.currency as AccountCurrencyCode
                          ] as IconName
                        }
                        description={acc.alias}
                        cards={acc.cards}
                        id={acc.id}
                      />
                    </Link>
                  ))}
                </CollapsibleSection>
              )}

              {multiCurrencyAccounts.length > 0 && (
                <CollapsibleSection
                  key={"multiCurrency"}
                  title={t("accounts.widget.multiCurrencyAccounts")}
                >
                  {multiCurrencyAccounts.map((acc) => (
                    <Link key={acc.id} href={"/private/accounts/" + acc.id}>
                      <AccountOption
                        key={acc.number}
                        amount={acc.balance.currentBalance}
                        currencySymbol={acc.currency as AccountCurrencyCode}
                        description={acc.alias}
                        icon={"24/Primary/Coins"}
                        cards={acc.cards}
                        id={acc.id}
                      />
                    </Link>
                  ))}
                </CollapsibleSection>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      <div className="flex flex-col gap-y-2 p-4 pt-0">
        <Button size="M" variant="accent">
          {t("common.buttonText.newProduct")}
          <Icon
            name={"24/Primary/AddCircle"}
            className="text-typography-surface-inverse"
          />
        </Button>
      </div>
    </>
  );
}
