"use client";

import { Suspense } from "react";
import { RegistrationPageComponent } from "@/features/registration/components/verification/RegistrationPageComponent";

import { LoaderModal } from "@/components/ui/loader-modal";
import { Overlay } from "@/components/ui/overlay";

import GuestLayout from "../_layout/GuestLayout";

export default function RegistrationPage() {
  return (
    <Suspense
      fallback={
        <Overlay visible>
          <LoaderModal visible />
        </Overlay>
      }
    >
      <GuestLayout>
        <RegistrationPageComponent />
      </GuestLayout>
    </Suspense>
  );
}
