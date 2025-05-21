"use client";

import * as React from "react";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ChangeEventHandler,
  type FocusEventHandler,
} from "react";
import { type VariantProps } from "class-variance-authority";
import {
  AsYouType,
  formatIncompletePhoneNumber,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";

import { COUNTRIES } from "@/lib/countries";
import { cn } from "@/lib/utils";
import { inputVariants } from "@/components/ui/input";

const initialCountry = (COUNTRIES.find((country) => country.value === "EE") ??
  COUNTRIES[0])!;
const initialPhoneCode = "+" + getCountryCallingCode(initialCountry.value);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  clearable?: boolean;
  onClear?: () => void;
  isPlaceholderNotTransformed?: boolean;
}

const InputTel = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const {
      children,
      onChange: defaultOnChange,
      onBlur: defaultOnBlur,
      value: defaultValue,
      onFocus,
      placeholder: defaultPlaceholder,
      listItemVariant,
      isPlaceholderNotTransformed,
      ...textInputProps
    } = props;

    const asYouTypeRef = useRef<AsYouType>(new AsYouType(initialCountry.value));
    const [country, setCountry] = useState(initialCountry);
    const [phone, setPhone] = useState(
      defaultValue
        ? formatIncompletePhoneNumber(String(defaultValue))
        : defaultValue
    );

    useEffect(() => {
      if (defaultValue) {
        const initialValue =
          (String(defaultValue).startsWith("+") ? "" : "+") +
          String(defaultValue);
        setPhone(formatIncompletePhoneNumber(initialValue));
        asYouTypeRef.current.reset();
        asYouTypeRef.current.input(String(initialValue));
        const countryCode = asYouTypeRef.current.getCountry();

        if (countryCode) {
          if (countryCode !== country?.value) {
            const countryItem = (COUNTRIES.find(
              (country) => country.value === countryCode
            ) ?? COUNTRIES[0])!;
            setCountry(countryItem);
            const code = "+" + getCountryCallingCode(countryItem.value);
            setPlaceholder(code + " ");
          }
        }
      }
    }, [defaultValue]);

    const [placeholder, setPlaceholder] = useState(
      defaultPlaceholder ?? initialPhoneCode
    );
    const [valid, setValid] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (ref) {
        if (typeof ref === "function") {
          ref(inputRef.current);
        } else {
          ref.current = inputRef.current;
        }
      }
    }, [ref]);

    const handleChangePhone: ChangeEventHandler<HTMLInputElement> = (e) => {
      if (!e.target.value.trim()) {
        const res = e.target.value;
        setPhone(res);
        defaultOnChange!(e);
        return;
      }
      const rawValue =
        (e.target.value.startsWith("+") ? "" : "+") + e.target.value;
      const formatted = formatIncompletePhoneNumber(rawValue, country.value);
      asYouTypeRef.current.reset();
      asYouTypeRef.current.input(rawValue);
      const countryCode = asYouTypeRef.current.getCountry();
      setPhone(formatted);
      e.target.value = formatted;
      defaultOnChange!(e);

      if (countryCode) {
        if (countryCode !== country.value) {
          const countryItem = (COUNTRIES.find(
            (country) => country.value === countryCode
          ) ?? COUNTRIES[0])!;
          setCountry(countryItem);
          const code = "+" + getCountryCallingCode(countryItem.value);
          setPlaceholder(code + " ");
        }
      }
    };
    const handleChangeCountry = (nextCountryCode: CountryCode) => {
      const countryItem = (COUNTRIES.find(
        (country) => country.value === nextCountryCode
      ) ?? COUNTRIES[0])!;
      const code = "+" + getCountryCallingCode(countryItem.value);
      setCountry(countryItem);
      asYouTypeRef.current = new AsYouType(nextCountryCode);
      asYouTypeRef.current.input(code);

      if (inputRef.current) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set;
        nativeInputValueSetter?.call(inputRef.current, code + " ");
        const event = new Event("input", { bubbles: true });
        inputRef.current?.dispatchEvent(event);
      }

      setTimeout(() => {
        requestAnimationFrame(() => {
          setPhone(code + " ");
          setPlaceholder(code + " ");
          inputRef.current?.focus();
        });
      }, 200);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleOnBlur: FocusEventHandler<HTMLInputElement> = (_e) => {
      asYouTypeRef.current.reset();
      //const formatted = asYouTypeRef.current.input(e.target.value);
      if (!asYouTypeRef.current.getChars()) {
        // setPhone(
        //   "+" + getCountryCallingCode((asYouTypeRef as any).current.country)
        // );
      }
      setValid(asYouTypeRef.current.isPossible());
      setIsFocused(false);
    };

    return (
      <div
        className={cn(
          "relative flex w-full",
          inputVariants({ listItemVariant }),
          "items-center overflow-hidden p-0"
        )}
      >
        {/* TODO: uncomment if we need to select country */}
        {/* <Select value={country?.value} onValueChange={handleChangeCountry}>
          <SelectTrigger
            className="absolute -mt-px w-14 border-0 bg-transparent pr-1.5"
            aria-label="Select country code"
          >
            <SelectValue placeholder="phoneCode">
              <div className={"flex items-center gap-2 rounded-sm overflow-hidden"}>
                <Icon name={("flags/" + country.value) as IconName} />
                {/*{"+" + getCountryCallingCode(country.value)}* /}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent position={"popper"}>
            {COUNTRIES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                <div className={"flex grow items-center gap-2"}>
                  <Icon
                    name={("flags/" + value) as IconName}
                    className={"w-5"}
                  />{" "}
                  <span className={"flex grow"}>{label}</span>
                  <span className={"text-typography-secondary"}>
                    {"+" + getCountryCallingCode(value)}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
        {/* TODO: swap left-4 to left-12 if we need to select country */}
        {!isPlaceholderNotTransformed ? (
          <span
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 transform text-typography-secondary transition-all duration-200 ease-in-out",
              "left-4",
              // "left-12",
              isFocused || props.value
                ? "top-4 text-12-medium text-typography-secondary"
                : "",
              props.disabled && "text-typography-disabled"
            )}
          >
            {defaultPlaceholder}
          </span>
        ) : null}
        {/* TODO: uncomment pl-12 if we need to select country */}
        <input
          aria-label={placeholder ?? " "}
          type={type}
          className={cn(
            "flex h-14 w-full border-input bg-fill-primary p-4 text-16-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-typography-secondary focus:bg-fill-secondary-active focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            // "pl-12",
            className,
            (isFocused || props.value) && !isPlaceholderNotTransformed
              ? "pb-2 pt-6"
              : ""
          )}
          ref={inputRef}
          placeholder={isPlaceholderNotTransformed ? placeholder : ""}
          value={phone}
          onChange={handleChangePhone}
          onBlur={handleOnBlur}
          onFocus={handleFocus}
          {...textInputProps}
        />
      </div>
    );
  }
);
InputTel.displayName = "InputTel";

export { InputTel };
