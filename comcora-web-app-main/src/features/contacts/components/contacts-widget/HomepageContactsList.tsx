import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Avatar } from "@/components/ui/Avatar";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ThumbnailButton } from "@/components/ui/ThumbnailButton";

import { useContacts } from "../../hooks/ContactsProvider";

const LIMIT = 6;

export const HomepageContactsList = () => {
  const { t } = useTranslation();
  const { contacts, isLoading } = useContacts();

  const [keyword, setKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <Command className={"relative overflow-visible bg-transparent"}>
        <CommandInput
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onValueChange={(term) => setKeyword(term)}
          placeholder={t("contacts.searchText")}
          searchTerm={keyword}
          setSearchTerm={setKeyword}
        />
        <CommandList
          className={`${isFocused || keyword ? "flex" : "hidden"} absolute top-12 z-20 w-full flex-col rounded-3xl bg-fill-primary shadow-sm`}
        >
          <CommandEmpty>{t("common.notifications.noResults")}</CommandEmpty>
          {contacts.map((contact) => (
            <CommandItem
              key={contact.id}
              className="flex-1 cursor-pointer rounded-t-3xl bg-fill-primary p-2 aria-selected:bg-fill-primary"
            >
              <Link
                href={`/private/contacts/${contact.id}`}
                className={"flex-1"}
              >
                <div
                  className={
                    "flex flex-1 items-center gap-4 rounded-[20px] bg-fill-primary p-2 hover:bg-fill-secondary"
                  }
                >
                  <Avatar
                    size={"M"}
                    src={contact.profilePicture}
                    alt={contact.name}
                    showBadge={contact.isCustomer}
                    className={"rounded-xl bg-fill-accent"}
                  />
                  <span className={"text-16-semibold text-typography-primary"}>
                    {contact.name}
                  </span>
                </div>
              </Link>
            </CommandItem>
          ))}
        </CommandList>
      </Command>
      <div className="flex gap-4 rounded-3xl bg-fill-primary p-4 shadow-m">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <ThumbnailButton key={`skeleton-${index}`}>
              <div className="size-18 animate-pulse rounded-3xl bg-muted" />
            </ThumbnailButton>
          ))
        ) : (
          <>
            <Link href="/private/contacts/new-contact">
              <ThumbnailButton title={t("common.buttonText.newContact")} />
            </Link>
            {contacts.slice(0, LIMIT).map((contact) => (
              <Link key={contact.id} href={`/private/contacts/${contact.id}`}>
                <ThumbnailButton title={contact.name}>
                  <Avatar
                    size="L"
                    showBadge={contact.isCustomer}
                    src={contact.profilePicture}
                    alt={contact.name}
                  />
                </ThumbnailButton>
              </Link>
            ))}
          </>
        )}
      </div>
    </>
  );
};
