"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RequisiteDetailsSheet from "@/features/contacts/components/contact-details/RequisiteDetailsSheet";
import { ContactsList } from "@/features/contacts/components/contacts-list/ContactsList";
import { useContacts } from "@/features/contacts/hooks/ContactsProvider";
import PaymentOption from "@/features/payments/components/PaymentOption";
import {
  type ContactPaymentRequisiteViewDTO,
  type ContactViewDTO,
} from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import { useTranslation } from "react-i18next";

import { cn, maskAccountNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFormField } from "@/components/ui/form";

import AddBank from "./AddBank";
import User from "./User";

type ReceiverWidgetProps = {
  requisiteId?: string;
};

export default function ReceiverWidget({ requisiteId }: ReceiverWidgetProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedUserId = searchParams.get("userId");
  const selectedRequisiteId = searchParams.get("requisiteId");
  const userId = searchParams.get("userId");
  const { t } = useTranslation();
  const [selectedContact, setSelectedContact] = useState<ContactViewDTO>();
  const [openContactsList, setOpenContactsList] = useState(false);
  const { favourites, contacts, contact } = useContacts();
  const { setValue } = useFormField();
  const [beneficiaryRequisiteId, setBeneficiaryRequisiteId] = useState<
    string | null
  >(selectedRequisiteId);
  const [openRequisiteDetails, setOpenRequisiteDetails] = useState(false);

  useEffect(() => {
    if (selectedUserId) {
      const user = contacts.find((contact) => contact.id === selectedUserId);
      if (user) {
        setSelectedContact(user);
      }
    }
  }, [contacts, selectedUserId]);

  useEffect(() => {
    if (contact?.id) {
      setSelectedContact(contact);
    }
  }, [contact]);

  useEffect(() => {
    if (requisiteId) {
      setValue("beneficiaryRequisiteId", requisiteId, {
        shouldValidate: true,
      });
      setBeneficiaryRequisiteId(requisiteId);
    }
  }, [requisiteId, setValue]);

  useEffect(() => {
    if (selectedRequisiteId) {
      setValue("beneficiaryRequisiteId", selectedRequisiteId, {
        shouldValidate: true,
      });
      setBeneficiaryRequisiteId(selectedRequisiteId);
    }
  }, [selectedRequisiteId, setValue]);

  const setSelectedBank = useCallback(
    (bank?: ContactPaymentRequisiteViewDTO) => {
      const bankId = bank?.id;
      setValue("beneficiaryRequisiteId", bankId);
      setBeneficiaryRequisiteId(bankId ?? null);

      if (bankId) {
        const params = new URLSearchParams(window.location.search);
        params.set("requisiteId", bankId);
        router.replace(`${window.location.pathname}?${params.toString()}`);
      }
    },
    [setValue, router]
  );

  useEffect(() => {
    if (!beneficiaryRequisiteId && selectedContact?.paymentRequisites.length) {
      setSelectedBank(selectedContact.paymentRequisites[0]);
    }
  }, [selectedContact, setSelectedBank, beneficiaryRequisiteId]);

  return (
    <div className="flex flex-col gap-y-4">
      {!userId ? (
        <div className="flex flex-row items-center justify-between">
          <p className="text-24-medium text-typography-primary">
            {t("payments.main.addRecipient")}
          </p>

          <Button
            variant={"primary"}
            onClick={(e) => {
              e.preventDefault();
              setOpenContactsList(true);
            }}
          >
            {t("payments.main.contactsList")}
          </Button>
        </div>
      ) : (
        <p className="text-24-medium text-typography-primary">
          {t("contacts.whom")}
        </p>
      )}
      {selectedContact ? (
        <div className="flex flex-col gap-4">
          <PaymentOption
            name={selectedContact.name}
            avatar={selectedContact.profilePicture}
          />
          <div className="flex items-start gap-4">
            <AddBank contactId={selectedContact.id} />
            {selectedContact.paymentRequisites.map((item) => (
              <div className={"flex flex-col"} key={item.id}>
                <div
                  className={"cursor-pointer"}
                  onClick={() => setSelectedBank(item)}
                >
                  <User
                    avatar={item.financialInstitutionIcon}
                    name={item.financialInstitutionName}
                    size={"small"}
                    selected={item.id === beneficiaryRequisiteId}
                    country={item.country}
                    colorType={"primary"}
                  />
                </div>
                <span
                  className={cn(
                    "text-center text-10-medium",
                    item.id === beneficiaryRequisiteId
                      ? "cursor-pointer text-typography-success"
                      : "text-typography-secondary"
                  )}
                  onClick={() => {
                    if (item.id === beneficiaryRequisiteId) {
                      setOpenRequisiteDetails(true);
                    }
                  }}
                >
                  {maskAccountNumber(item.accountNumber)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-nowrap gap-4 overflow-x-auto">
          {favourites.map((favourite) => (
            <div
              key={favourite.id}
              onClick={() => {
                setSelectedContact(favourite);
                const params = new URLSearchParams(window.location.search);
                params.set("userId", favourite.id);
                params.delete("requisiteId");
                router.push(`${window.location.pathname}?${params.toString()}`);
              }}
            >
              <User
                avatar={favourite.profilePicture}
                name={favourite.name}
                avatarSize={"L"}
                isCustomer={favourite.isCustomer}
                avatarStatusSize="M"
                size="small"
                className="cursor-pointer"
                avatarClassName="bg-fill-primary"
              />
            </div>
          ))}
        </div>
      )}
      <ContactsList
        open={openContactsList}
        showRadio
        onClose={() => {
          setOpenContactsList(false);
        }}
        onAdd={(contactId) => {
          setSelectedContact(
            contacts.find((contact) => contact.id === contactId)
          );
          setOpenContactsList(false);
        }}
        context={"payments"}
      />
      {openRequisiteDetails && (
        <RequisiteDetailsSheet
          open={openRequisiteDetails}
          onClose={() => setOpenRequisiteDetails(false)}
          paymentRequisite={
            selectedContact?.paymentRequisites.find(
              (item) => item.id === selectedRequisiteId
            ) ?? ({} as ContactPaymentRequisiteViewDTO)
          }
          contactId={contact?.id ?? ""}
          context={"payments"}
        />
      )}
    </div>
  );
}
