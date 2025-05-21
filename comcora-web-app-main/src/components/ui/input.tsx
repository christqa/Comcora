"use client";

import * as React from "react";
import { useCallback, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export const inputVariants = cva(
  "flex h-14 w-full border-input bg-fill-primary p-4 pr-12 text-16-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-typography-secondary focus:bg-fill-secondary-active focus-visible:outline-none disabled:cursor-not-allowed disabled:text-typography-disabled",
  {
    variants: {
      listItemVariant: {
        default: `rounded-2xl`,
        "split-up": `rounded-t-2xl`,
        "split-half": `rounded-none`,
        "split-down": `rounded-b-2xl`,
      },
    },
    defaultVariants: {
      listItemVariant: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  clearable?: boolean;
  editable?: boolean;
  onClear?: () => void;
  isPlaceholderNotTransformed?: boolean;
  description?: string;
  errorMessage?: string;
  slotRight?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      children,
      type,
      listItemVariant = "default",
      clearable = false,
      onClear,
      onFocus,
      onBlur,
      placeholder,
      isPlaceholderNotTransformed,
      editable = false,
      id,
      description,
      errorMessage,
      slotRight,
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleTogglePasswordVisible = useCallback(
      (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsPasswordVisible((prev) => !prev);
      },
      []
    );

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    return (
      <div className="flex flex-col gap-2">
        <div className="relative">
          {!isPlaceholderNotTransformed ? (
            <label
              htmlFor={id}
              className={cn(
                "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transform text-typography-secondary transition-all duration-200 ease-in-out",
                isFocused || props.value
                  ? "left-4 top-4 text-12-medium text-typography-secondary"
                  : "",
                props.disabled && "text-typography-disabled"
              )}
            >
              {placeholder}
            </label>
          ) : null}
          {slotRight}
          <input
            id={id}
            type={isPasswordVisible ? "text" : type}
            placeholder={isPlaceholderNotTransformed ? placeholder : ""}
            aria-label={placeholder ?? ""}
            className={cn(
              inputVariants({ listItemVariant }),
              errorMessage && "bg-fill-secondary-critical",
              className,
              (isFocused || props.value) && !isPlaceholderNotTransformed
                ? "pb-2 pt-6"
                : "",
              slotRight && "pl-12"
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            ref={ref}
            {...props}
          />
          {children}
          {clearable && onClear && props.value ? (
            <Button
              className={cn(
                "absolute right-4 top-4 h-auto w-fit !bg-transparent p-0",
                (editable || errorMessage) && "right-12"
              )}
              size="icon"
              variant="ghost"
              onClick={() => onClear()}
              aria-label="Clear input"
            >
              <Icon
                name="24/Primary/CrossCircle"
                className="size-6 text-icon-secondary"
              />
            </Button>
          ) : null}
          {type === "password" ? (
            <Button
              className="absolute right-4 top-4 h-auto w-fit !bg-transparent p-0"
              size="icon"
              variant="primary"
              onClick={handleTogglePasswordVisible}
              aria-label="Show password"
            >
              <Icon
                name={
                  !isPasswordVisible ? "24/Primary/EyeClosed" : "24/Primary/Eye"
                }
                className={`size-6 ${!isPasswordVisible ? "text-icon-secondary" : "text-icon-surface-inverse"}`}
              />
            </Button>
          ) : null}
          {errorMessage && (
            <Icon
              name="24/Primary/Warning"
              className="absolute right-4 top-4 size-6 text-icon-critical"
            />
          )}
        </div>
        {errorMessage && (
          <p className="px-4 text-12-medium text-typography-critical">
            {errorMessage}
          </p>
        )}
        {description && (
          <p className="px-4 text-12-medium text-typography-secondary">
            {description}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
