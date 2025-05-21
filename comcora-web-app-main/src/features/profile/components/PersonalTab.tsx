"use client";

import { useEffect, useState } from "react";
import { AvatarEditorDialog } from "@/features/profile/components/AvatarEditorDialog/AvatarEditorDialog";
import {
  useProfile,
  type PostalAddress,
} from "@/features/profile/components/ProfileContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { extractAddressData } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar } from "@/components/ui/Avatar";
import { EditableInput } from "@/components/ui/editable-input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Addresses from "@/components/ui/MapAddresses";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  fullName: z.string().min(1),
  birthDate: z.string().min(1),
  userAlias: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().min(1),
  address: z.string().min(1),
});

export const PersonalTab = () => {
  const { t } = useTranslation();

  const {
    profile,
    updateComcoraId,
    updateEmail,
    updatePhone,
    updateAddress,
    isUpdateAddressPending,
    isUpdateComcoraIdPending,
    isUpdateEmailPending,
    isUpdatePhonePending,
  } = useProfile();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: profile?.fullName ?? "",
      birthDate: "",
      userAlias: profile?.alias ?? "",
      phone: profile?.phone ?? "",
      email: profile?.email ?? "",
      address: profile?.address ?? "",
    },
  });

  const [selectedAddress, setSelectedAddress] = useState("");
  const [addressDetails, setAddressDetails] = useState<PostalAddress>({
    country: "",
    state: "",
    city: "",
    streetAddressAndApartment: "",
    postalCode: "",
  });

  useEffect(() => {
    if (profile && Object.keys(profile).length) {
      form.reset({
        fullName: profile.fullName,
        birthDate: "",
        userAlias: profile.alias,
        phone: profile.phone,
        email: profile.email,
        address: profile.address,
      });
    }
  }, [profile, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const values = form.getValues();

  const handleAddressChange = (
    value: google.maps.places.PlaceResult | null
  ) => {
    if (value?.formatted_address) {
      setSelectedAddress(value.formatted_address);
      form.setValue("address", value.formatted_address);
    }

    if (value?.address_components) {
      const extractedAddress = extractAddressData(value.address_components);
      setAddressDetails(extractedAddress);
    }
  };

  return (
    <div className={"mt-10 flex flex-col gap-y-10"}>
      <div className="flex gap-x-4">
        <div className="flex w-20 gap-x-4">
          <div className="flex size-20 rounded-3xl">
            {profile ? (
              <AvatarEditorDialog>
                <Avatar
                  src={profile?.picture}
                  className="cursor-pointer border-0"
                  fallBackClassName="bg-fill-secondary"
                  textClassName="text-20-medium text-typography-secondary"
                  size={"XL"}
                  alt={profile.fullName}
                />
              </AvatarEditorDialog>
            ) : (
              <Skeleton className="mx-auto size-20 self-center rounded-xl bg-fill-black-a02" />
            )}
          </div>
        </div>
        <div className="flex grow flex-col items-start gap-y-2">
          {profile ? (
            <h4 className="text-32-medium text-typography-primary">
              {profile.fullName.split(" ")[0]}
              <br />
              {profile.fullName.split(" ")[1]}
            </h4>
          ) : (
            <div className={"flex flex-col gap-y-1 py-1"}>
              <Skeleton className="h-8 w-40 rounded-xl bg-fill-black-a02" />
              <Skeleton className="h-8 w-40 rounded-xl bg-fill-black-a02" />
            </div>
          )}
          {profile ? (
            <div className="flex h-6 rounded-lg bg-fill-primary-success px-3 py-1">
              <span className="text-center text-12-medium text-typography-surface">
                {profile?.alias}
              </span>
            </div>
          ) : (
            <Skeleton className="h-6 w-32 rounded-lg bg-fill-primary-success" />
          )}
        </div>
      </div>
      <Form {...form}>
        <form
          className={"flex flex-col gap-y-8"}
          onSubmit={form.handleSubmit(onSubmit)}
          action=""
        >
          <div className="flex flex-col gap-y-4">
            <span className="text-24-medium text-typography-primary">
              {t("profile.personalDetails.details")}
            </span>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled
                      listItemVariant={"default"}
                      placeholder={t("common.credentials.nameSurname")}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled
                      listItemVariant={"default"}
                      placeholder={t("common.credentials.birthday")}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userAlias"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <EditableInput
                      listItemVariant={"default"}
                      placeholder="Comcora ID"
                      isDirty={form.formState.dirtyFields.userAlias}
                      onSave={() =>
                        updateComcoraId(values.userAlias).then(
                          ({ success }) => {
                            if (success) {
                              form.setValue("userAlias", values.userAlias, {
                                shouldDirty: false,
                              });
                              form.reset({ ...form.getValues() });
                              toast({
                                title: t(
                                  "profile.messages.comcoraIdChanged.web"
                                ),
                              });
                            }
                          }
                        )
                      }
                      onClear={() => form.setValue("userAlias", "")}
                      clearable={form.formState.dirtyFields.userAlias}
                      loading={isUpdateComcoraIdPending}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-y-4">
            <span className="text-24-medium text-typography-primary">
              {t("profile.changeData.contacts")}
            </span>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <EditableInput
                      listItemVariant={"default"}
                      placeholder={t("common.credentials.phoneNumber")}
                      isDirty={form.formState.dirtyFields.phone}
                      onSave={() =>
                        updatePhone(values.phone).then(({ success }) => {
                          if (success) {
                            form.setValue("phone", values.phone);
                            toast({
                              title: t(
                                "profile.messages.phoneNumberChanged.web"
                              ),
                            });
                          }
                        })
                      }
                      onClear={() => form.setValue("phone", "")}
                      clearable={form.formState.dirtyFields.phone}
                      loading={isUpdatePhonePending}
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
                    <EditableInput
                      listItemVariant={"default"}
                      placeholder="E-mail"
                      isDirty={form.formState.dirtyFields.email}
                      onSave={() =>
                        updateEmail(values.email).then(({ success }) => {
                          if (success) {
                            form.setValue("email", values.email);
                            toast({
                              title: t("profile.messages.emailChanged.web"),
                            });
                          }
                        })
                      }
                      onClear={() => form.setValue("email", "")}
                      clearable={form.formState.dirtyFields.email}
                      loading={isUpdateEmailPending}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-y-4">
            <span className="text-24-medium text-typography-primary">
              {t("common.credentials.address")}
            </span>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Addresses
                      handleAddressChange={handleAddressChange}
                      isDirty={!!selectedAddress}
                      onSave={() =>
                        updateAddress(addressDetails).then(({ success }) => {
                          if (success) {
                            setSelectedAddress("");
                            toast({
                              title: t("profile.messages.addressChanged.web"),
                            });
                          }
                        })
                      }
                      loading={isUpdateAddressPending}
                      clearable
                      onClear={() => {
                        form.setValue("address", "");
                        setSelectedAddress("");
                      }}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};
