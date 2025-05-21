import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ActivityForm } from "@/features/registration/components/ActivityForm";
import { AddressForm } from "@/features/registration/components/AddressForm";
import { ChooseAccountType } from "@/features/registration/components/ChooseAccountType";
import { CreatePasswordForm } from "@/features/registration/components/CreatePasswordForm";
import { EmailForm } from "@/features/registration/components/EmailForm";
import { RegistrationForm } from "@/features/registration/components/RegistrationForm";
import { UsernameForm } from "@/features/registration/components/UsernameForm";
import { VerificationForm } from "@/features/registration/components/verification/VerificationForm";

import { BackNavigationControl } from "@/components/ui/BackNavigationControl";
import { Stepper } from "@/components/ui/Stepper";

const getScreen = (step: number, nextStep: () => void): JSX.Element | null => {
  const screens = {
    1: <RegistrationForm />,
    2: <CreatePasswordForm nextStep={nextStep} />,
    3: <VerificationForm nextStep={nextStep} />,
    4: <AddressForm nextStep={nextStep} />,
    5: <EmailForm nextStep={nextStep} />,
    6: <UsernameForm nextStep={nextStep} />,
    7: <ActivityForm nextStep={nextStep} />,
    8: <ChooseAccountType />,
  };
  return screens[step as keyof typeof screens] || null;
};

export const RegistrationPageComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const step = parseInt(searchParams.get("step") ?? "1", 10);
  const nextStep = () => router.push(`/registration?step=${step + 1}`);
  const onBackClick = () => {
    if (step > 1) {
      router.push(`/registration?step=${step - 1}`);
    }
  };

  useEffect(() => {
    if (!searchParams.has("step")) {
      router.replace(`/registration?step=1`);
    }
  }, [searchParams, router]);
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Stepper step={step} stepsCount={8} />
      <div className="flex size-full flex-col">
        <div className={"fixed left-8 top-[115px]"}>
          <BackNavigationControl onClick={onBackClick} />
        </div>
        {getScreen(step, nextStep)}
      </div>
    </div>
  );
};
