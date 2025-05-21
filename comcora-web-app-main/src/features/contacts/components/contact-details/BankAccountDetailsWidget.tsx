import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RequisiteDetailsSheet from "@/features/contacts/components/contact-details/RequisiteDetailsSheet";
import RequisitesConfigureSheet from "@/features/contacts/components/contact-details/RequisitesConfigureSheet";
import User from "@/features/payments/components/User";
import { type ContactPaymentRequisiteViewDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import { useTranslation } from "react-i18next";

import { maskAccountNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Icon } from "@/components/ui/icon";
import { ListOption } from "@/components/ui/list-option";
import { Skeleton } from "@/components/ui/skeleton";
import { Thumbnail } from "@/components/ui/thumbnail";
import { ThumbnailButton } from "@/components/ui/ThumbnailButton";

import { useContacts } from "../../hooks/ContactsProvider";

export const BankAccountDetailsWidget = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { contact, isContactLoading } = useContacts();
  const [currentRequisiteIdx, setCurrentRequisiteIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const [openRequisitesSheet, setOpenRequisitesSheet] = useState(false);

  const { paymentRequisites } = contact ?? {};

  const handleChangeRequisite = useCallback((idx: number) => {
    setCurrentRequisiteIdx(idx);
    setOpen(true);
  }, []);

  return (
    <div className={"flex flex-col gap-4"}>
      {isContactLoading ? (
        <Skeleton className="h-14 w-full rounded-3xl bg-fill-primary p-4" />
      ) : (
        <>
          {contact?.paymentRequisites.length ? (
            <>
              <div className="flex gap-4">
                <h2 className="flex-1 text-24-medium">
                  {t("contacts.availableAccounts")}
                </h2>
                <Button
                  variant="secondary-success"
                  size="S"
                  className="shrink-0"
                  onClick={() => setOpenRequisitesSheet(true)}
                >
                  {t("common.buttonText.configure")}
                </Button>
              </div>
              <div className="rounded-3xl bg-fill-primary p-4">
                <Carousel orientation="horizontal">
                  <CarouselPrevious />
                  <CarouselContent>
                    {!isContactLoading && paymentRequisites ? (
                      <>
                        <ThumbnailButton
                          title={t("common.buttonText.add")}
                          onClick={() =>
                            router.push(
                              `/private/contacts/edit-contact/${contact?.id}`
                            )
                          }
                        />
                        {paymentRequisites.map(
                          (
                            {
                              id,
                              financialInstitutionName,
                              financialInstitutionIcon,
                              accountNumber,
                              country,
                            },
                            idx
                          ) => (
                            <ThumbnailButton
                              key={id}
                              title={financialInstitutionName}
                              subtitle={maskAccountNumber(accountNumber)}
                              onClick={() => handleChangeRequisite(idx)}
                              className={"rounded-3xl"}
                            >
                              <User
                                avatar={financialInstitutionIcon}
                                name={financialInstitutionName}
                                size={"small"}
                                country={country}
                                showLabel={false}
                                avatarSize="L"
                              />
                            </ThumbnailButton>
                          )
                        )}
                      </>
                    ) : (
                      Array.from({ length: 5 }).map((_, index) => (
                        <ThumbnailButton key={`skeleton-${index}`}>
                          <div className="size-18 animate-pulse rounded-3xl bg-muted" />
                        </ThumbnailButton>
                      ))
                    )}
                  </CarouselContent>
                  <CarouselNext />
                </Carousel>
              </div>
            </>
          ) : (
            <Link href={`/private/contacts/edit-contact/${contact?.id}`}>
              <ListOption containerClassName="rounded-3xl my-4">
                <Thumbnail variant={"accent"}>
                  <Icon
                    name={"16/Primary/Plus"}
                    className="size-4 text-typography-surface-inverse"
                  />
                </Thumbnail>
                <div className="flex h-10 grow items-center">
                  <p className="text-16-semibold text-typography-primary">
                    {t("contacts.account.addAccount")}
                  </p>
                </div>
              </ListOption>
            </Link>
          )}
        </>
      )}
      {open && (
        <RequisiteDetailsSheet
          open={open}
          onClose={() => setOpen(false)}
          paymentRequisite={
            paymentRequisites?.[currentRequisiteIdx] ??
            ({} as ContactPaymentRequisiteViewDTO)
          }
          contactId={contact?.id ?? ""}
        />
      )}
      <RequisitesConfigureSheet
        contactId={contact?.id ?? ""}
        open={openRequisitesSheet}
        onClose={() => setOpenRequisitesSheet(false)}
        requisites={contact?.paymentRequisites ?? []}
      />
    </div>
  );
};
