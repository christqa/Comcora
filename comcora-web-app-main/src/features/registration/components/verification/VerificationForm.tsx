import { useState, type FC } from "react";
import { AppDownload } from "@/features/login/components/AppDownload";

import { DocUploadScreen } from "./DocUploadScreen";

type VerificationFormProps = {
  nextStep: () => void;
};

export const VerificationForm: FC<VerificationFormProps> = ({ nextStep }) => {
  const [localStep, setLocalStep] = useState(1);
  const [docType, setDocType] = useState("");

  console.log(localStep);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <DocUploadScreen nextStep={nextStep} />
      </div>
      <AppDownload />
    </div>
  );
};
