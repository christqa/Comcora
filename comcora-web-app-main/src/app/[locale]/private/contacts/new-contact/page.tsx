"use client";

import { Suspense } from "react";
import { NewContact } from "@/features/contacts/components/new-contact/NewContact";
import { ContactsProvider } from "@/features/contacts/hooks/ContactsProvider";
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
        <h1 className="text-32-medium text-typography-primary">
          {t("contacts.newContact.title")}
        </h1>
      </div>
      <ContactsProvider>
        <Suspense
          fallback={
            <Overlay visible>
              <LoaderModal visible />
            </Overlay>
          }
        >
          <NewContact />
        </Suspense>
      </ContactsProvider>
    </div>
  );
}
