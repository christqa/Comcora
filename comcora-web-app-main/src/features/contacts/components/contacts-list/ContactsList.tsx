"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { ListOption } from "@/components/ui/list-option";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioOption } from "@/components/ui/radio-option";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchField } from "@/components/ui/SearchField";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Thumbnail } from "@/components/ui/thumbnail";

import { useContacts } from "../../hooks/ContactsProvider";

interface ContactsListProps {
  open: boolean;
  selectedIds?: string[];
  showCheckbox?: boolean;
  showRadio?: boolean;
  onSelect?: () => void;
  onClose: () => void;
  onAdd: (checkedIds?: string[] | string) => void;
  context?: string;
}

export function ContactsList(props: ContactsListProps) {
  const {
    open,
    onClose,
    showCheckbox,
    showRadio,
    selectedIds,
    onAdd,
    context,
  } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { contacts } = useContacts();
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [checkedIds, setCheckedIds] = useState<string[]>(selectedIds ?? []);
  const [checkedId, setCheckedId] = useState<string>();

  useEffect(() => {
    setFilteredContacts(contacts);
    setCheckedId(contacts[0]?.id);
  }, [contacts]);

  useEffect(() => {
    if (selectedIds) {
      setCheckedIds(selectedIds);
    }
  }, [selectedIds]);

  const onSearch = useCallback(
    (searchTerm: string) => {
      setFilteredContacts(
        contacts.filter((contact) =>
          contact.name
            .toLocaleLowerCase()
            .includes(searchTerm.toLocaleLowerCase())
        )
      );
    },
    [contacts]
  );

  const onCheck = (contactId: string) => {
    if (checkedIds.includes(contactId)) {
      setCheckedIds(checkedIds.filter((id) => id !== contactId));
    } else {
      setCheckedIds([...checkedIds, contactId]);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="flex h-full flex-col">
        <SheetHeader className="flex-none pb-[10px]">
          <SheetTitle>{t("shared.contactsList")}</SheetTitle>
        </SheetHeader>
        {contacts.length ? (
          <>
            <SearchField
              placeholder={t("contacts.searchText")}
              onSearch={onSearch}
            />
            {context !== "favorites" && (
              <Link href={"/private/contacts/new-contact"}>
                <ListOption
                  containerClassName="rounded-3xl my-4 p-4"
                  className={"px-0"}
                >
                  <Thumbnail variant={"accent"}>
                    <Icon
                      name={"16/Primary/Plus"}
                      className="size-4 text-typography-surface-inverse"
                    />
                  </Thumbnail>
                  <div className="flex h-10 grow items-center">
                    <p className="text-16-semibold text-typography-primary">
                      {t("common.buttonText.addNew")}
                    </p>
                  </div>
                </ListOption>
              </Link>
            )}
            <ScrollArea
              className={cn(
                "flex-1",
                context === "favorites" && "my-6",
                context === "payments" && "mb-6"
              )}
            >
              {filteredContacts.length ? (
                <div className="rounded-3xl bg-fill-primary">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex grow cursor-pointer items-center gap-x-4 rounded-3xl p-4"
                      onClick={() => {
                        if (!showCheckbox && !showRadio) {
                          router.push(`/private/contacts/${contact.id}`);
                        }
                      }}
                    >
                      <Avatar
                        size="M"
                        statusSize="S"
                        src={contact.profilePicture}
                        alt={contact.name}
                        showBadge={contact.isCustomer}
                        className="rounded-xl"
                      />
                      <span className="text-16-semibold text-typography-primary">
                        {contact.name}
                      </span>
                      {showRadio && (
                        <RadioGroup
                          key={contact.id}
                          onValueChange={() => setCheckedId(contact.id)}
                          value={checkedId}
                          className={"w-fit flex-1"}
                        >
                          <RadioOption
                            listItemVariant={"default"}
                            id={contact.id}
                            value={contact.id}
                            className="self-end p-0"
                            radioIconType={"rounded"}
                          />
                        </RadioGroup>
                      )}
                      {showCheckbox && (
                        <div className={"flex flex-1 justify-end"}>
                          <div>
                            <Checkbox
                              checked={checkedIds?.includes(contact.id)}
                              rounded={true}
                              className={"flex flex-1 justify-end"}
                              onClick={() => onCheck(contact.id)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 pt-[50px]">
                  <div className="text-16-medium text-typography-critical">
                    {t("common.notifications.noResults")}
                  </div>
                  <span className="text-12-medium text-typography-secondary">
                    {t("common.notifications.tryChangingCriteria")}
                  </span>
                </div>
              )}
            </ScrollArea>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6">
            <div className="flex size-[72px] justify-center rounded-3xl bg-fill-secondary-caution">
              <Icon
                className={"size-10 text-icon-critical"}
                name={"40/Caution/Warning"}
              />
            </div>
            <span className="text-center text-32-medium">
              {t("shared.contactsListEmpty")}
            </span>
            <span className="text-center text-16-medium text-typography-secondary">
              {t("shared.addNewContact")}
            </span>
          </div>
        )}
        {context === "payments" || context === "favorites" ? (
          <SheetFooter>
            <div>
              <div className="relative">
                <div className="absolute inset-x-0 bottom-0 h-[24px] bg-gradient-fade"></div>
              </div>
              <div className="flex flex-col bg-fill-background-main">
                <Button
                  size={"L"}
                  variant={"accent"}
                  type={"submit"}
                  onClick={() => onAdd(showCheckbox ? checkedIds : checkedId)}
                >
                  {t("common.buttonText.add")}
                </Button>
              </div>
            </div>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
