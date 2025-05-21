"use client";

import React, {
  createContext,
  useContext,
  type FC,
  type PropsWithChildren,
} from "react";
import {
  useConfirmation,
  type ConfirmationInit,
} from "@/features/confirmation/hooks/ConfirmationContext";
import { useAuth } from "@/features/login/hooks/AuthContext";
import { updatePhotoCall } from "@/features/profile/api/updatePhotoCall";
import { api } from "@/features/trpc-client/hooks/react";
import { type UserProfileDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models";

export type PostalAddress = {
  country: string;
  state: string;
  city: string;
  streetAddressAndApartment: string;
  postalCode: string;
};

export interface ProfileContextMethods {
  profile?: UserProfileDTO;
  updateComcoraId: (value: string) => Promise<{ success: boolean }>;
  updateEmail: (value: string) => Promise<{ success: boolean }>;
  updatePhone: (value: string) => Promise<{ success: boolean }>;
  updatePhoto: (value: Blob) => Promise<{ success: boolean }>;
  updateAddress: (value: PostalAddress) => Promise<{ success: boolean }>;
  isUpdateComcoraIdPending: boolean;
  isUpdateEmailPending: boolean;
  isUpdatePhonePending: boolean;
  isUpdateAddressPending: boolean;
}
export const ProfileContext = createContext<ProfileContextMethods>({
  profile: undefined,
  updateComcoraId: () => Promise.resolve({ success: false }),
  updateEmail: () => Promise.resolve({ success: false }),
  updatePhone: () => Promise.resolve({ success: false }),
  updatePhoto: () => Promise.resolve({ success: false }),
  updateAddress: () => Promise.resolve({ success: false }),
  isUpdateComcoraIdPending: false,
  isUpdateEmailPending: false,
  isUpdatePhonePending: false,
  isUpdateAddressPending: false,
});

const ProfileProvider: FC<PropsWithChildren> = ({ children }) => {
  const { encryptedAccessPin } = useAuth();
  const { confirm } = useConfirmation();
  const { data: profile } = api.profile.retrieve.useQuery(undefined, {
    enabled: Boolean(encryptedAccessPin),
  });

  const {
    mutateAsync: updateComcoraIdCall,
    isPending: isUpdateComcoraIdPending,
  } = api.profile.updateComcoraId.useMutation();

  const { mutateAsync: updateEmailCall, isPending: isUpdateEmailPending } =
    api.profile.updateEmail.useMutation();

  const { mutateAsync: updatePhoneCall, isPending: isUpdatePhonePending } =
    api.profile.updatePhone.useMutation();

  const { mutateAsync: updateAddressCall, isPending: isUpdateAddressPending } =
    api.profile.updateAddress.useMutation();

  // const { mutateAsync: updatePhotoCall, isPending: isUpdatePhotoPending } =
  //   api.profile.updatePhoto.useMutation();

  const utils = api.useUtils();

  const updateComcoraId = async (nextValue: string) => {
    // TODO: confirmation is not implemented on the backend side, we will just simulate the process
    const confirmationDetails = await new Promise<ConfirmationInit>((r) => {
      setTimeout(
        () =>
          r({
            type: "phone",
          }),
        600
      );
    });

    const { success } = await confirm(confirmationDetails);

    if (!success) {
      return { success: false };
    }
    await updateComcoraIdCall({ userAlias: nextValue });
    return {
      success: true,
    };
  };

  const updateEmail = async (nextValue: string) => {
    // TODO: confirmation is not implemented on the backend side, we will just simulate the process
    const confirmationDetails = await new Promise<ConfirmationInit>((r) => {
      setTimeout(
        () =>
          r({
            type: "phone",
          }),
        600
      );
    });

    const { success } = await confirm(confirmationDetails);

    if (!success) {
      return { success: false };
    }
    await updateEmailCall({ email: nextValue });
    return {
      success: true,
    };
  };

  const updatePhone = async (nextValue: string) => {
    // TODO: confirmation is not implemented on the backend side, we will just simulate the process
    const confirmationDetails = await new Promise<ConfirmationInit>((r) => {
      setTimeout(
        () =>
          r({
            type: "phone",
          }),
        600
      );
    });

    const { success } = await confirm(confirmationDetails);

    if (!success) {
      return { success: false };
    }
    await updatePhoneCall({ phoneNumber: nextValue });
    return {
      success: true,
    };
  };

  const updateAddress = async (nextValue: PostalAddress) => {
    // TODO: confirmation is not implemented on the backend side, we will just simulate the process
    const confirmationDetails = await new Promise<ConfirmationInit>((r) => {
      setTimeout(
        () =>
          r({
            type: "phone",
          }),
        600
      );
    });

    const { success } = await confirm(confirmationDetails);

    if (!success) {
      return { success: false };
    }
    console.log(nextValue, "nextValue");
    await updateAddressCall({ address: nextValue });
    return {
      success: true,
    };
  };

  const updatePhoto = async (nextValue: Blob) => {
    const bodyFormData = new FormData();
    bodyFormData.append("image", nextValue);
    console.log(bodyFormData);

    await updatePhotoCall(bodyFormData, encryptedAccessPin);

    await utils.profile.invalidate();

    return {
      success: true,
    };
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateComcoraId,
        updateEmail,
        updatePhone,
        updatePhoto,
        updateAddress,
        isUpdateAddressPending,
        isUpdateComcoraIdPending,
        isUpdateEmailPending,
        isUpdatePhonePending,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);

export default ProfileProvider;
