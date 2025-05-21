"use client";

import { type FC } from "react";
import { type TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { resolveListItemVariant } from "@/lib/utils";
import { ListOption } from "@/components/ui/list-option";

const generateVerificationMethodsOptions = (t: TFunction) => {
  return [
    {
      name: `${t("auth.registration.residencePermit")}`,
      value: "residencePermit",
    },
    {
      name: `${t("auth.registration.idCard")}`,
      value: "idCard",
    },
    {
      name: `${t("auth.registration.passport")}`,
      value: "passport",
    },
  ];
};

type VerificationMethodFormProps = {
  nextLocalStep: () => void;
  setDocType: (v: string) => void;
};

export const VerificationMethodForm: FC<VerificationMethodFormProps> = ({
  nextLocalStep,
  setDocType,
}) => {
  const { t } = useTranslation();
  const activityOptions = generateVerificationMethodsOptions(t);

  const handleSelectDocType = (docType: string) => {
    setDocType(docType);
    nextLocalStep();
  };

  return (
    <div className={"flex h-full flex-col justify-between"}>
      {
        <div className={"flex flex-col items-center gap-10"}>
          <h2 className="text-center text-32-medium text-typography-primary">
            {t("auth.registration.chooseVerificationMethod")}
          </h2>
          <div className="min-w-[375px] rounded-3xl bg-fill-primary px-4 py-2">
            {activityOptions.map(({ value, name }, index) => (
              <ListOption
                key={value}
                containerClassName="rounded-3xl p-0"
                listItemVariant={resolveListItemVariant(
                  index,
                  activityOptions.length
                )}
                onClick={() => handleSelectDocType(value)}
              >
                <p className="m-2 grow py-2 text-16-semibold">{name}</p>
              </ListOption>
            ))}
          </div>
        </div>
      }
    </div>
  );
};
