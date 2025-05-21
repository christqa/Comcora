import { type BankContact } from "@/features/contact/lib/contact";
import { type ContactDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models";

export const buildFromContactDto = (item: ContactDTO): BankContact => {
  return {
    id: item.id,
    name: item.name,
    aliasName: item.name,
    phone: item.phoneNumber,
    external: !item.hasCurrentFiRequisite,
    favourite: item.isFavourite,
    image: item.profilePicture,
    contactType: item.paymentRequisites?.length
      ? item.paymentRequisites[0]?.type === "PRIVATE"
        ? "person"
        : "company"
      : "person",
    paymentRequisites: item.paymentRequisites?.map((requisite) => ({
      iban: requisite.accountNumber,
      institution: requisite?.financialInstitutionName,
    })),
  };
};
