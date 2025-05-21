"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { NewContact } from "@/features/contacts/components/new-contact/NewContact";
import { ContactsProvider } from "@/features/contacts/hooks/ContactsProvider";
import { useTranslation } from "react-i18next";

import { BackNavigationControl } from "@/components/ui/BackNavigationControl";
import { LoaderModal } from "@/components/ui/loader-modal";
import { Overlay } from "@/components/ui/overlay";

export default function Page() {
  const { t } = useTranslation();
  const pathname = useParams();
  const { contactId } = pathname;
  const id = Array.isArray(contactId) ? contactId[0] : contactId;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <BackNavigationControl />
        <h1 className="text-32-medium text-typography-primary">
          {t("contacts.newContact.newAccount")}
        </h1>
      </div>
      <ContactsProvider contactId={id}>
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
