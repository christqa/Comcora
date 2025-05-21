"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppDownload } from "@/features/login/components/AppDownload";
import { useTranslation } from "react-i18next";

import { mockCountries } from "@/lib/mock-data";
import { resolveListItemVariant } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/icon";
import { ListOption } from "@/components/ui/list-option";
import { SearchField } from "@/components/ui/SearchField";
import { Thumbnail } from "@/components/ui/thumbnail";

export function CountrySelect() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filteredCountries, setFilteredCountries] = useState(mockCountries);

  const onSearch = useCallback((searchTerm: string) => {
    const filteredCountries = mockCountries.filter((country) =>
      country.label.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    );

    setFilteredCountries(filteredCountries);
  }, []);

  const onCountrySelect = (country: string) => {
    const currentStep = parseInt(searchParams.get("step") ?? "1", 10);
    const nextStep = currentStep + 1;

    router.push(`/registration?step=${nextStep}`);
  };

  return (
    <div className={"flex h-full w-[375px] flex-col justify-between"}>
      <div className={"flex flex-1 flex-col items-center gap-10"}>
        <h2 className="self-center text-center text-32-medium text-typography-primary">
          {t("auth.registration.residentOfCountry")}
        </h2>
        <div className="custom-scroll flex w-full flex-col gap-2">
          <SearchField
            placeholder={t("common.placeholder.search")}
            onSearch={onSearch}
          />

          <div className="rounded-3xl bg-fill-primary pr-1">
            <div className="max-h-[359px] overflow-auto rounded-3xl">
              {filteredCountries.map(({ id, value, label }, index) => (
                <ListOption
                  key={id}
                  listItemVariant={resolveListItemVariant(
                    index,
                    filteredCountries.length
                  )}
                  onClick={() => onCountrySelect(label)}
                >
                  <Thumbnail variant="light">
                    <Icon name={("flags/" + value) as IconName} />
                  </Thumbnail>
                  <p className="mt-2 grow text-16-semibold">{label}</p>
                </ListOption>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AppDownload className="mt-[45px]" />
    </div>
  );
}
