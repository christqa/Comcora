"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ContactsList } from "@/features/contacts/components/contacts-list/ContactsList";
import { useContacts } from "@/features/contacts/hooks/ContactsProvider";
import User from "@/features/payments/components/User";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const Favourites = () => {
  const { t } = useTranslation();
  const { favourites } = useContacts();
  const { changeFavourites } = useContacts();
  const [open, setOpen] = useState(false);

  const onAdd = (contactIds?: string | string[]) => {
    if (!contactIds || !Array.isArray(contactIds)) {
      return;
    }

    changeFavourites(contactIds);
    setOpen(false);
  };
  const router = useRouter();
  return (
    <div className="flex flex-col gap-y-4">
      <p className="text-24-medium text-typography-primary">
        {t("payments.main.favorite")}
      </p>
      <div className="flex flex-nowrap gap-4 overflow-x-auto">
        <div className="flex h-auto min-h-24 w-24 flex-col gap-y-2.5">
          <div className="flex min-h-24 w-24 items-center justify-center rounded-4xl border-2 border-dashed border-fill-secondary-active">
            <Button
              variant="transparent"
              className="size-full p-0"
              aria-label={t("common.buttonText.add")}
              onClick={() => setOpen(true)}
            >
              <Icon
                name={"24/Primary/Plus"}
                className="text-typography-secondary"
              />
            </Button>
          </div>
          <p className="text-center text-12-medium text-typography-primary">
            {t("common.buttonText.add")}
          </p>
        </div>
        {favourites.map(({ name, profilePicture, id, isCustomer }) => (
          <div
            key={id}
            onClick={() =>
              router.push(`/private/payments/new-payment?userId=${id}`)
            }
            className="cursor-pointer"
          >
            <User
              key={id}
              name={name}
              avatar={profilePicture}
              size={"large"}
              isCustomer={isCustomer}
              avatarSize="XXL"
              avatarClassName="bg-fill-primary"
            />
          </div>
        ))}
      </div>
      <ContactsList
        open={open}
        onClose={() => setOpen(false)}
        showCheckbox
        selectedIds={favourites.map((favorite) => favorite.id)}
        onAdd={onAdd}
        context={"favorites"}
      />
    </div>
  );
};

export default Favourites;
