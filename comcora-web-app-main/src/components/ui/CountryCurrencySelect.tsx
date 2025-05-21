import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { mockCountries, mockCurrencies } from "@/lib/mock-data";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";

import { ScrollArea } from "./scroll-area";
import { Thumbnail } from "./thumbnail";

interface CountryCurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
  variant?: string;
  label?: string;
}

export const CountryCurrencySelect = ({
  value,
  onChange,
  label,
  variant,
}: CountryCurrencySelectProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const data = variant === "country" ? mockCountries : mockCurrencies;

  const currentValue = data.find((item) => item.value === value);
  const filteredData = data.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={searchQuery || (currentValue ? currentValue.label : "")}
        placeholder={label}
        clearable
        slotRight={
          currentValue ? (
            <div
              className={
                "absolute left-4 top-1/2 h-4 -translate-y-1/2 text-24-medium"
              }
            >
              {currentValue.flag}
            </div>
          ) : null
        }
        onClear={() => {
          setSearchQuery("");
          onChange("");
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        className="cursor-pointer"
      />

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-1 w-full rounded-2xl bg-white shadow-md">
          <ScrollArea maxHeight="240px">
            <div className="p-2">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="group flex cursor-pointer items-center justify-between rounded-[20px] p-2 hover:bg-gray-100"
                    onMouseDown={() => {
                      onChange(item.value);
                      setSearchQuery("");
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <Thumbnail variant={"light"}>
                        <span>{item.flag}</span>
                      </Thumbnail>
                      <span className="text-16-semibold">{item.label}</span>
                    </div>
                    {value === item.value && <Icon name="16/Success/Check" />}
                  </div>
                ))
              ) : (
                <div className="p-2 text-center text-gray-500">
                  {t("common.notifications.noResults")}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
