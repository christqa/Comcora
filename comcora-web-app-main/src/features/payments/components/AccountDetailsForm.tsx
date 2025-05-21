"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NewContact } from "@/features/contacts/components/new-contact/NewContact";
import { useContacts } from "@/features/contacts/hooks/ContactsProvider";
import {
  type ContactCreationRequestDTO,
  type ContactViewDTO,
} from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import { useTranslation } from "react-i18next";

import { Switch } from "@/components/ui/switch";

export default function AccountDetailsForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { addContact } = useContacts();

  const [createContact, setCreateContact] = useState(true);

  const onSubmit = async (values: ContactCreationRequestDTO) => {
    if (createContact) {
      const contact = (await addContact({
        ...values,
        email: values.email ?? undefined,
      })) as ContactViewDTO;

      router.push(`/private/payments/new-payment?userId=${contact.id}`);
    }
  };

  return (
    <NewContact
      submitText={t("payments.main.addRecipient")}
      onSubmit={onSubmit}
      actions={
        <Switch
          label={t("transactions.addContact")}
          id={"add-contact"}
          checked={createContact}
          onCheckedChange={setCreateContact}
        />
      }
    />
  );
}
