"use client";

import { type ReactElement } from "react";
import NewContactForm from "@/features/contacts/components/new-contact/NewContactForm";
import { type ContactCreationRequestDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export enum RequisiteType {
  Private = "PRIVATE",
  Company = "COMPANY",
}

interface NewContactProps {
  actions?: ReactElement;
  submitText?: string;
  onSubmit?: (values: ContactCreationRequestDTO) => void;
}

export const NewContact = ({
  actions,
  submitText,
  onSubmit,
}: NewContactProps) => {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue={RequisiteType.Private} className={"w-full"}>
      <TabsList>
        <TabsTrigger value={RequisiteType.Private}>
          {t("contacts.newContact.individual")}
        </TabsTrigger>
        <TabsTrigger value={RequisiteType.Company}>
          {t("contacts.newContact.business")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value={RequisiteType.Private} className={"mt-10"}>
        <NewContactForm
          contactType={RequisiteType.Private}
          actions={actions}
          submitText={submitText}
          onSubmit={onSubmit}
        />
      </TabsContent>
      <TabsContent value={RequisiteType.Company} className={"mt-10"}>
        <NewContactForm
          contactType={RequisiteType.Company}
          actions={actions}
          submitText={submitText}
          onSubmit={onSubmit}
        />
      </TabsContent>
    </Tabs>
  );
};
