import * as React from "react";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  clearable?: boolean;
  onFocus?: () => void;
}

export function InputAddress(props: InputProps) {
  const { t } = useTranslation();
  return (
    <Input
      placeholder={t("common.credentials.residentialAddress")}
      {...props}
    />
  );
}
