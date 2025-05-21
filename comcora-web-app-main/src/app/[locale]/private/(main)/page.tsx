"use client";

import { ContactsHomepageWidget } from "@/features/contacts/components/contacts-widget/ContactsHomepageWidget";
import { ContactsProvider } from "@/features/contacts/hooks/ContactsProvider";
import { WelcomeMessage } from "@/features/profile/components/WelcomeMessage";
import Banner from "@/features/promo/components/Banner";
import { StoryLine } from "@/features/story/components/StoryLine";
import { StoryProvider } from "@/features/story/lib/StoryContext";
import { LatestTransactionsWidget } from "@/features/transactions/components/LatestTransactionsWidget";
import { RegularWidget } from "@/features/transactions/components/RegularWidget";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components/ui/icon";

const Page = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-10">
        <WelcomeMessage />
        <StoryProvider>
          <StoryLine />
        </StoryProvider>
        <section className="flex gap-x-4">
          <RegularWidget
            href={"/private/payments/new-payment"}
            title={t("payments.main.newPayment")}
            icon={<Icon name="24/Primary/Flag" className="size-6" />}
            className={"flex-1"}
          />
          <RegularWidget
            href={"/private/payments/between-accounts"}
            title={t("home.products.betweenAccounts")}
            icon={
              <Icon name="24/Primary/RoundAltArrowHalf" className="size-6" />
            }
            className={"flex-1"}
          />
          <RegularWidget
            href={"/private/payments/request-money"}
            title={t("home.products.moneyRequest")}
            icon={<Icon name="24/Primary/CashOut" className="size-6" />}
            className={"flex-1"}
          />
        </section>
        <LatestTransactionsWidget />
        <ContactsProvider>
          <ContactsHomepageWidget />
        </ContactsProvider>
        <Banner />
      </div>
    </div>
  );
};

export default Page;
