import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export const NoContactsWidget = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between rounded-3xl bg-fill-primary p-4">
      <div className="flex items-center gap-4">
        <Avatar
          size={"M"}
          src="/contacts/avatar-1.png"
          alt="Avatar"
          className={"rounded-xl bg-fill-accent"}
        />
        <div className="flex flex-col">
          <p className={"text-16-semibold text-typography-primary"}>
            {t("contacts.addContact")}
          </p>
          <span className={"text-12-medium text-typography-secondary"}>
            {t("contacts.addContactDesc")}
          </span>
        </div>
      </div>
      <Button size="M" variant="accent">
        <Link href="/private/contacts/new-contact">
          {t("common.buttonText.add")}
        </Link>
        <Icon
          name={"24/Primary/AddCircle"}
          className="text-typography-surface-inverse"
        />
      </Button>
    </div>
  );
};
