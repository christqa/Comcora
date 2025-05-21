"use client";

import { Suspense } from "react";
import { ContactsProvider } from "@/features/contacts/hooks/ContactsProvider";
import AccountDetailsForm from "@/features/payments/components/AccountDetailsForm";
import { useTranslation } from "react-i18next";

import { BackNavigationControl } from "@/components/ui/BackNavigationControl";
import { LoaderModal } from "@/components/ui/loader-modal";
import { Overlay } from "@/components/ui/overlay";

export default function Page() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <BackNavigationControl />
        <h4 className="text-32-medium text-typography-primary">
          {t("payments.accountDetails.title")}
        </h4>
      </div>
      <ContactsProvider>
        <Suspense
          fallback={
            <Overlay visible>
              <LoaderModal visible />
            </Overlay>
          }
        >
          <AccountDetailsForm />
        </Suspense>
      </ContactsProvider>
    </div>
  );
}
