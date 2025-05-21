"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DeleteModal from "@/features/invoices/components/DeleteModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ContactViewDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useContacts } from "../../hooks/ContactsProvider";

interface EditControlProps {
  contact: ContactViewDTO;
}

export function EditAccountControl({ contact }: EditControlProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const formSchema = useMemo(
    () =>
      z.object({
        name: z
          .string()
          .min(1)
          .regex(/^[A-Za-z\s\-']+$/, { message: t("common.form.invalidName") }),
        email: z.string().email().optional().or(z.literal("")),
      }),
    [t]
  );

  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const { deleteContact, updateContact } = useContacts();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const handleEditContact = async (values: z.infer<typeof formSchema>) => {
    await updateContact({
      contactId: contact.id,
      name: values.name,
      email: values.email,
    });

    setOpenDeleteModal(false);
    setOpen(false);
  };
  useEffect(() => {
    if (contact) {
      form.setValue("name", contact.name);
      form.setValue("email", contact.email);
    }
  }, [contact]);

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => setOpen(v)}>
        <SheetTrigger asChild={true}>
          <Button
            size="S"
            variant={"secondary-success"}
            className={"w-[131px]"}
          >
            {t("common.buttonText.edit")}
          </Button>
        </SheetTrigger>

        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("contacts.editContact")}</SheetTitle>
            <div className="flex flex-col gap-4">
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          onClear={() => form.setValue("name", "")}
                          clearable={true}
                          errorMessage={form.formState.errors.name?.message}
                          placeholder={t("contacts.placeholders.fullName")}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          onClear={() => form.setValue("email", "")}
                          clearable={true}
                          errorMessage={form.formState.errors.email?.message}
                          placeholder={t("contacts.placeholders.email")}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </Form>
            </div>
          </SheetHeader>

          <SheetFooter>
            <div className="flex flex-col gap-[16px]">
              <Button
                onClick={form.handleSubmit(handleEditContact, (errors) =>
                  console.log(errors)
                )}
                size={"L"}
                variant={"accent"}
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
              >
                {t("common.buttonText.save")}
              </Button>
              <Button
                size={"L"}
                variant={"secondary-critical"}
                onClick={() => setOpenDeleteModal(true)}
              >
                {t("contacts.deleteContact")}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <DeleteModal
        onDelete={() => {
          void deleteContact(contact.id);
          router.push("/private");
          setOpenDeleteModal(false);
          setOpen(false);
        }}
        onCancel={() => setOpenDeleteModal(false)}
        title={t("contacts.deleteThisContact")}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        description={t("contacts.deleteContactWarning")}
        btnText={t("common.buttonText.delete")}
      />
    </>
  );
}
