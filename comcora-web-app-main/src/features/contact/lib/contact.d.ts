import { type Image } from "expo-contacts/src/Contacts";

export enum BankContactTypes {
  /**
   * Contact is a human.
   */
  Person = "person",
  /**
   * Contact is group or company.
   */
  Company = "company",
}

export type BankContactType = BankContactTypes | `${BankContactTypes}`;

export type PaymentRequisite = {
  iban: string;
  institution: string;
};

export type BankContact = {
  id?: string;
  contactType: BankContactType;
  /* Name of the contact by phone book */
  aliasName?: string;
  name?: string;
  phone?: string;
  image?: Image;
  external?: boolean;
  favourite?: boolean;
  paymentRequisites?: PaymentRequisite[];
};
