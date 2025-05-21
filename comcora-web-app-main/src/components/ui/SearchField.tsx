import React, {
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useTranslation } from "react-i18next";

import useDebounce from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";

type SearchInputProps = {
  hint?: string;
  placeholder?: string;
  onSearch?: (v: string) => void;
};

export function SearchField(props: PropsWithChildren<SearchInputProps>) {
  const { hint, placeholder, onSearch } = props;
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    []
  );

  return (
    <div className={"w-full"}>
      <div className={"flex w-full"}>
        <div className={"relative flex-1"}>
          <Input
            isPlaceholderNotTransformed={true}
            className="flex h-10 items-center gap-x-2 rounded-xl bg-fill-primary p-2 px-10"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleChange}
          />
          <Icon
            name={"24/Primary/Search"}
            className={"absolute left-2 top-2 size-6 text-icon-secondary"}
          />
          {searchTerm ? (
            <>
              <Button
                className="absolute right-2 top-2 h-auto w-fit bg-transparent p-0"
                size="icon"
                variant="primary"
                onClick={() => setSearchTerm("")}
              >
                <Icon
                  name="24/Primary/CrossCircle"
                  className="size-6 text-icon-secondary"
                />
              </Button>
            </>
          ) : null}
        </div>
        {searchTerm && (
          <div>
            <Button
              variant={"transparent"}
              className={"p-0 pl-[20px] pr-[10px]"}
              onClick={() => setSearchTerm("")}
            >
              <span className={"text-typography-success"}>
                {t("common.buttonText.cancel")}
              </span>
            </Button>
          </div>
        )}
      </div>
      {hint ? (
        <div className="flex justify-between px-2 pt-2">
          <p className="grow text-12-medium text-typography-secondary">
            {hint}
          </p>
        </div>
      ) : null}
    </div>
  );
}
