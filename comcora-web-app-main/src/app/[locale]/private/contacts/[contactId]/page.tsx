"use client";

import { BankAccountDetailsWidget } from "@/features/contacts/components/contact-details/BankAccountDetailsWidget";
import { ContactCover } from "@/features/contacts/components/contact-details/ContactCover";
import { ContactsProvider } from "@/features/contacts/hooks/ContactsProvider";

import { BackNavigationControl } from "@/components/ui/BackNavigationControl";

type PageProps = {
  params: { contactId: string };
};

export default function ContactDetailsPage(props: PageProps) {
  const {
    params: { contactId: contactId },
  } = props;

  return (
    <ContactsProvider contactId={contactId}>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <BackNavigationControl />
            <ContactCover />
          </div>
          <BankAccountDetailsWidget />
        </div>
      </div>
    </ContactsProvider>
  );
}
