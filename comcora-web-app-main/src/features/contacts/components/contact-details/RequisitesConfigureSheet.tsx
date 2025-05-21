import { useCallback, useEffect, useState } from "react";
import { AccountControl } from "@/features/contacts/components/contact-details/AccountControl";
import { useContacts } from "@/features/contacts/hooks/ContactsProvider";
import DeleteModal from "@/features/invoices/components/DeleteModal";
import type { ContactPaymentRequisiteViewDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import { useTranslation } from "react-i18next";

import { delay, maskAccountNumber } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SearchField } from "@/components/ui/SearchField";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Thumbnail } from "@/components/ui/thumbnail";

type RequisitesConfigureSheetProps = {
  open: boolean;
  onClose: () => void;
  requisites: ContactPaymentRequisiteViewDTO[];
  contactId: string;
};

const RequisitesConfigureSheet = (props: RequisitesConfigureSheetProps) => {
  const { open, onClose, requisites, contactId } = props;
  const { t } = useTranslation();
  const { deleteRequisite } = useContacts();
  const { toast } = useToast();

  const [filteredRequisites, setFilteredRequisites] = useState(requisites);
  const [selectedRequisiteId, setSelectedRequisiteId] = useState("");
  const [openDeleteRequisite, setOpenDeleteRequisite] = useState(false);
  const [openDeleteAllRequisites, setOpenDeleteAllRequisites] = useState(false);

  useEffect(() => {
    setFilteredRequisites(requisites);
  }, [requisites]);

  const onSearch = useCallback(
    (searchTerm: string) => {
      const lowercasedTerm = searchTerm.toLowerCase();

      setFilteredRequisites(
        requisites.filter(
          (requisite) =>
            requisite.financialInstitutionName
              .toLowerCase()
              .includes(lowercasedTerm) ||
            requisite.accountNumber.toString().includes(lowercasedTerm)
        )
      );
    },
    [requisites]
  );

  const handleDeleteRequisite = async (requisiteId: string) => {
    setSelectedRequisiteId(requisiteId);
    onClose();
    await delay(300);
    setOpenDeleteRequisite(true);
  };

  const handleDeleteAllRequisites = async () => {
    if (!requisites.length) return;

    for (const requisite of requisites) {
      try {
        await deleteRequisite({ contactId, requisiteId: requisite.id });
      } catch (error) {
        console.error(`Failed to delete requisite ${requisite.id}:`, error);
      }
    }
    setOpenDeleteAllRequisites(false);
    toast({
      title: t("contacts.accountsDelete"),
    });
  };

  const onDeleteAllAccounts = async () => {
    onClose();
    await delay(300);
    setOpenDeleteAllRequisites(true);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="flex h-full flex-col">
          <SheetHeader className="flex-none pb-[10px]">
            <SheetTitle>{t("profile.settings.title")}</SheetTitle>
          </SheetHeader>
          {requisites.length ? (
            <>
              <SearchField
                placeholder={t("shared.searchContact")}
                onSearch={onSearch}
              />
              <div className="my-4 flex-1 overflow-y-auto">
                {filteredRequisites.length ? (
                  <div className="rounded-3xl bg-fill-primary">
                    {filteredRequisites.map((req) => (
                      <div
                        key={req.id}
                        className="flex grow cursor-pointer items-center gap-x-4 rounded-3xl p-4"
                      >
                        <Avatar
                          size="M"
                          src={req.financialInstitutionIcon}
                          alt={req.financialInstitutionName}
                          className="rounded-xl"
                        />
                        <div className="flex grow flex-col gap-1">
                          <span className="text-16-semibold text-typography-primary">
                            {req.financialInstitutionName}
                          </span>
                          <span className="text-12-medium text-typography-secondary">
                            {maskAccountNumber(req.accountNumber)}
                          </span>
                        </div>
                        <Button
                          size="icon"
                          className={
                            "size-auto bg-transparent hover:bg-transparent"
                          }
                          onClick={() => handleDeleteRequisite(req.id)}
                        >
                          <Thumbnail variant={"light"}>
                            <Icon
                              name={"24/Primary/TrashBin"}
                              className={"text-typography-secondary"}
                            />
                          </Thumbnail>
                        </Button>
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
              </div>
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
          <SheetFooter>
            <div>
              <div className="relative">
                <div className="absolute inset-x-0 bottom-0 h-[24px] bg-gradient-fade"></div>
              </div>
              <div className="flex flex-col bg-fill-background-main">
                <Button
                  size={"L"}
                  variant={"secondary-critical"}
                  type={"submit"}
                  onClick={onDeleteAllAccounts}
                >
                  {t("common.buttonText.deleteAllAccounts")}
                </Button>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      {selectedRequisiteId && openDeleteRequisite && (
        <AccountControl
          contactId={contactId}
          requisiteId={selectedRequisiteId}
          open={openDeleteRequisite}
          setOpen={setOpenDeleteRequisite}
        />
      )}
      <DeleteModal
        title={t("contacts.account.deleteAllAccounts")}
        onDelete={handleDeleteAllRequisites}
        onCancel={() => setOpenDeleteAllRequisites(false)}
        open={openDeleteAllRequisites}
        setOpen={setOpenDeleteAllRequisites}
        description={t("contacts.account.allAccountsDeletionWarning")}
        btnText={t("common.buttonText.delete")}
        btnVariant={"accent"}
      />
    </>
  );
};

export default RequisitesConfigureSheet;
