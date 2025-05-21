import DeleteModal from "@/features/invoices/components/DeleteModal";
import { useTranslation } from "react-i18next";

import { useToast } from "@/hooks/use-toast";

import { useContacts } from "../../hooks/ContactsProvider";

interface AccountControlProps {
  contactId: string;
  requisiteId: string;
  open: boolean;
  setOpen: (v: boolean) => void;
}

export function AccountControl({
  contactId,
  requisiteId,
  open,
  setOpen,
}: AccountControlProps) {
  const { t } = useTranslation();
  const { deleteRequisite } = useContacts();
  const { toast } = useToast();

  const handleDelete = async () => {
    await deleteRequisite({ contactId, requisiteId }).then(() => {
      setOpen(false);
      toast({
        title: t("contacts.accountDelete"),
      });
    });
  };

  return (
    <DeleteModal
      title={t("contacts.account.deleteAccount")}
      onDelete={handleDelete}
      onCancel={() => setOpen(false)}
      open={open}
      setOpen={setOpen}
      description={t("contacts.account.accountDeletionWarning")}
      btnText={t("common.buttonText.delete")}
      btnVariant={"accent"}
    />
  );
}
