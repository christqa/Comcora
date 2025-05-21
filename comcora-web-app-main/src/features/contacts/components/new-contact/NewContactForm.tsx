import { useEffect, useMemo, type ReactElement } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { RequisiteType } from "@/features/contacts/components/new-contact/NewContact";
import { useContacts } from "@/features/contacts/hooks/ContactsProvider";
import { api } from "@/features/trpc-client/hooks/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ContactCreationRequestDTO,
  ContactViewDTO,
  PaymentRequisiteTypeDTO,
} from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import { type TFunction } from "i18next";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { mockCountries } from "@/lib/mock-data";
import { validateIBAN } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CountryCurrencySelect } from "@/components/ui/CountryCurrencySelect";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const createFormSchema = (t: TFunction) =>
  z.object({
    country: z.string().min(1),
    currency: z.string().min(1),
    accountNumber: z.string().min(7).max(34),
    name: z
      .string()
      .min(1, { message: t("common.form.required") })
      .regex(/^[A-Za-z\s\-']+$/, { message: t("common.form.invalidName") })
      .refine((value) => value.trim().length > 0, {
        message: t("common.form.invalidSpace"),
      }),
    email: z.string().email().optional().or(z.literal("")),
    type: z.string(),
  });

type FormSchemaType = ReturnType<typeof createFormSchema>;
type FormValues = z.infer<FormSchemaType> & { type: RequisiteType };

type NewContactFormProps = {
  contactType: RequisiteType;
  actions?: ReactElement;
  submitText?: string;
  onSubmit?: (values: ContactCreationRequestDTO) => void;
};

const NewContactForm = (props: NewContactFormProps) => {
  const { contactType, actions, submitText, onSubmit } = props;
  const { t } = useTranslation();
  const { toast } = useToast();
  const { addContact, updateContact, contact } = useContacts();
  const router = useRouter();
  const param = useParams();
  const searchParams = useSearchParams();
  const contactId = Array.isArray(param.contactId)
    ? param.contactId[0]
    : param.contactId;

  const requisite = {
    country: searchParams.get("country"),
    currency: searchParams.get("currency"),
    accountNumber: searchParams.get("accountNumber"),
    name: searchParams.get("name"),
  };

  const schema = useMemo(() => createFormSchema(t), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      country: requisite.country ?? "EE",
      currency: requisite.currency ?? "EUR",
      accountNumber: requisite.accountNumber ?? "",
      name: requisite.name ?? "",
      email: "",
      type: RequisiteType.Private,
    },
  });

  const watchedValues = form.watch();
  const isFormValid = schema.safeParse(watchedValues).success;

  const { data: financialInstitution } =
    api.financialInstitution.getFiDetails.useQuery(
      { accountNumber: watchedValues.accountNumber },
      {
        enabled: Boolean(validateIBAN(watchedValues.accountNumber)),
      }
    );

  useEffect(() => {
    if (contactId && contact?.name) {
      form.setValue("name", contact.name);
    }
  }, [contact, contactId, form]);

  const onSubmitForm = async (values: FormValues) => {
    if (onSubmit) {
      onSubmit({ ...values, type: contactType as PaymentRequisiteTypeDTO });
      return;
    }

    if (contactId) {
      await updateContact({
        contactId,
        paymentRequisites: [
          {
            ...values,
            type: contactType as PaymentRequisiteTypeDTO,
          },
        ],
      });
    } else {
      const createdContact = await addContact({
        ...values,
        email: values.email ?? undefined,
        type: contactType as PaymentRequisiteTypeDTO,
      });

      toast({
        title: t("contacts.newContact.added"),
      });

      if (createdContact) {
        router.push(
          `/private/contacts/${(createdContact as ContactViewDTO).id}`
        );
      }
    }

    const redirectUrl = searchParams.get("redirectUrl");

    if (redirectUrl) {
      router.push(redirectUrl);
    } else if (contactId) {
      router.push(`/private/contacts/${contactId}`);
    }

    form.reset();
  };

  const ibanCountry = useMemo(() => {
    const accountNumber = watchedValues.accountNumber;
    if (!accountNumber || !validateIBAN(accountNumber)) return null;

    const ibanCountryCode = accountNumber.slice(0, 2);
    return mockCountries.find((item) => item.value === ibanCountryCode);
  }, [watchedValues.accountNumber]);

  return (
    <Form {...form}>
      <form
        className="flex flex-1 flex-col gap-y-4"
        onSubmit={form.handleSubmit(onSubmitForm)}
      >
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <CountryCurrencySelect
              value={field.value}
              onChange={field.onChange}
              label={t("common.credentials.country")}
              variant={"country"}
            />
          )}
        />

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <CountryCurrencySelect
              value={field.value}
              onChange={field.onChange}
              label={t("common.credentials.currency")}
              variant={"currency"}
            />
          )}
        />

        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    type="text"
                    onClear={() => form.setValue("accountNumber", "")}
                    clearable={true}
                    errorMessage={form.formState.errors.accountNumber?.message}
                    placeholder={t("contacts.placeholders.accountNumber")}
                    slotRight={
                      ibanCountry && (
                        <div
                          className={
                            "absolute left-4 top-1/2 h-4 -translate-y-1/2 text-24-medium"
                          }
                        >
                          {ibanCountry.flag}
                        </div>
                      )
                    }
                    description={financialInstitution?.name}
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  onClear={() => form.setValue("name", "")}
                  required={true}
                  errorMessage={form.formState.errors.name?.message}
                  clearable={!(contactId && contact?.name)}
                  placeholder={t("contacts.placeholders.fullName")}
                  disabled={!!(contactId && contact?.name)}
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
                  type="email"
                  onClear={() => form.setValue("email", "")}
                  description={t("common.form.optional")}
                  clearable={true}
                  placeholder={t("contacts.placeholders.email")}
                  errorMessage={form.formState.errors.email?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div
          className={`flex items-center ${actions ? "justify-between" : "justify-end"}`}
        >
          {actions}
          <Button
            type="submit"
            className="self-end"
            variant="accent"
            size="L"
            disabled={!isFormValid || form.formState.isSubmitting}
          >
            {submitText ?? t("common.buttonText.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewContactForm;
