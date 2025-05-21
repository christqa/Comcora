import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { LoaderModal } from "@/components/ui/loader-modal";
import { Overlay } from "@/components/ui/overlay";

import { useContacts } from "../../hooks/ContactsProvider";
import { ContactsList } from "../contacts-list/ContactsList";
import { HomepageContactsList } from "./HomepageContactsList";
import { NoContactsWidget } from "./NoContactsWidget";

export const ContactsHomepageWidget = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { contacts, isLoading } = useContacts();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <h2 className="flex-1 text-24-medium">{t("shared.contactsTitle")}</h2>
        {contacts.length ? (
          <Button
            variant="secondary-success"
            size="S"
            className="shrink-0"
            onClick={() => setOpen(true)}
          >
            {t("common.buttonText.allContacts")}
          </Button>
        ) : null}
      </div>
      <Suspense
        fallback={
          <Overlay visible>
            <LoaderModal visible />
          </Overlay>
        }
      >
        {!isLoading && contacts.length === 0 ? (
          <NoContactsWidget />
        ) : (
          <HomepageContactsList />
        )}
      </Suspense>
      <ContactsList
        open={open}
        onClose={() => setOpen(false)}
        onAdd={() => router.push("/private/contacts/new-contact")}
      />
    </div>
  );
};
