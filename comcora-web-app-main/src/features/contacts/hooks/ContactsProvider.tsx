import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { api } from "@/features/trpc-client/hooks/react";
import {
  type ContactQueryResponseDTO,
  type ContactUpdateRequestDTO,
  type ContactViewDTO,
  type CreateContactWithRequisiteMutationRequest,
  type DeleteContactPathParams,
  type DeletePaymentRequisitePathParams,
} from "@xdatagroup/tbb-sdk/dist/api/services/business/models";

type ContactsProviderProps = {
  contactId?: string;
};

export type DeleteContactRequisiteMutationParams = {
  contactId: DeletePaymentRequisitePathParams["contactId"];
  requisiteId: DeletePaymentRequisitePathParams["paymentRequisiteId"];
};

export type UpdateContactProps = ContactUpdateRequestDTO & {
  contactId: string;
  type?: "PRIVATE" | "COMPANY";
  name?: string;
};

interface ContactsContextValue {
  contact?: ContactQueryResponseDTO;
  contacts: ContactViewDTO[];
  favourites: ContactViewDTO[];
  isLoading: boolean;
  isContactLoading?: boolean;
  error: Error | null;
  addContact: (
    data: CreateContactWithRequisiteMutationRequest
  ) => Promise<unknown>;
  updateContact: (data: UpdateContactProps) => Promise<unknown>;
  deleteContact: (
    contactId: DeleteContactPathParams["contactId"]
  ) => Promise<unknown>;
  deleteRequisite: (
    data: DeleteContactRequisiteMutationParams
  ) => Promise<unknown>;
  changeFavourites: (contactIds: string[]) => void;
}

const ContactsContext = createContext<ContactsContextValue | undefined>({
  contacts: [],
  favourites: [],
  isLoading: false,
  isContactLoading: false,
  error: null,
  addContact: () => Promise.resolve(),
  updateContact: () => Promise.resolve(),
  deleteContact: () => Promise.resolve(),
  deleteRequisite: () => Promise.resolve(),
  changeFavourites: () => {
    return;
  },
});

export function ContactsProvider(
  props: PropsWithChildren<ContactsProviderProps>
) {
  const { contactId, children } = props;
  const utils = api.useUtils();

  const {
    data: contacts = [],
    isLoading,
    error,
  } = api.contacts.getContactsList.useQuery();

  const { data: initialFavourites } = api.contacts.getFavourites.useQuery();
  const { data: initialContact, isLoading: isContactLoading } =
    api.contacts.getContact.useQuery(
      {
        contactId: contactId ?? "",
      },
      {
        enabled: Boolean(contactId),
      }
    );

  const { mutateAsync: createContact } =
    api.contacts.createContact.useMutation();
  const { mutateAsync: updateContact } = api.contacts.updateContact.useMutation(
    {
      onSuccess: () => {
        return Promise.all([
          utils.contacts.getContact.invalidate(),
          utils.contacts.getFavourites.invalidate(),
        ]);
      },
    }
  );
  const { mutateAsync: deleteContact } =
    api.contacts.deleteContact.useMutation();
  const { mutateAsync: deleteContactRequisite } =
    api.contacts.deleteContactRequisite.useMutation({
      onSuccess: () => utils.contacts.getContact.invalidate(),
    });

  const [favourites, setFavourites] = useState(initialFavourites);
  const [contact, setContact] = useState(initialContact);

  useEffect(() => {
    setFavourites(initialFavourites);
  }, [initialFavourites]);

  useEffect(() => {
    setContact(initialContact);
  }, [initialContact]);

  const addContact = useCallback(
    (data: CreateContactWithRequisiteMutationRequest) => {
      return createContact(data);
    },
    [createContact]
  );

  const changeFavourites = useCallback(
    (newFavoriteIds: string[]) => {
      const favouriteIds =
        favourites?.map((favourite: ContactViewDTO) => favourite.id) ?? [];
      const newFavorites = newFavoriteIds
        .map((id) => contacts.find((contact) => contact.id === id))
        .filter((contact) => !!contact) as ContactViewDTO[];

      newFavoriteIds.forEach((contactId) => {
        if (!favouriteIds.includes(contactId)) {
          void updateContact({ isFavourite: true, contactId });
        }
      });

      favouriteIds.forEach((favouriteId) => {
        if (!newFavoriteIds.includes(favouriteId)) {
          void updateContact({ isFavourite: false, contactId: favouriteId });
        }
      });

      setFavourites(newFavorites);
    },
    [updateContact, favourites, contacts]
  );

  const editContact = useCallback(
    (data: UpdateContactProps) => {
      return updateContact(data);
    },
    [updateContact]
  );

  const removeContact = useCallback(
    (contactId: DeleteContactPathParams["contactId"]) => {
      return deleteContact({ contactId });
    },
    [deleteContact]
  );

  const removeRequisite = useCallback(
    (data: DeleteContactRequisiteMutationParams) => {
      if (contact) {
        setContact({
          ...contact,
          paymentRequisites: contact?.paymentRequisites.filter(
            (requisite) => requisite.id !== data.requisiteId
          ),
        });
      }

      return deleteContactRequisite(data);
    },
    [deleteContactRequisite, contact]
  );

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        favourites: favourites ?? [],
        contact,
        isLoading,
        isContactLoading,
        error: error as Error | null,
        addContact,
        changeFavourites,
        updateContact: editContact,
        deleteContact: removeContact,
        deleteRequisite: removeRequisite,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error("useContacts must be used within a ContactsProvider");
  }
  return context;
}
