import * as React from "react";
import { useCallback, type MouseEventHandler } from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input, type inputVariants } from "@/components/ui/input";

export interface EditableInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  isDirty?: boolean;
  onSave?: (value?: string) => void;
  loading: boolean;
  isPlaceholderNotTransformed?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

const EditableInput = React.forwardRef<HTMLInputElement, EditableInputProps>(
  (
    {
      isDirty,
      onSave,
      loading,
      isPlaceholderNotTransformed = false,
      clearable,
      onClear,
      ...inputProps
    },
    ref
  ) => {
    const handleSave: MouseEventHandler<HTMLButtonElement> = useCallback(
      (e) => {
        if (onSave) {
          onSave();
        }
      },
      [onSave]
    );

    return (
      <div className={"relative"}>
        <Input
          {...inputProps}
          ref={ref}
          isPlaceholderNotTransformed={isPlaceholderNotTransformed}
          clearable={clearable}
          className={cn("truncate", isDirty && "pr-44")}
          editable={isDirty}
          onClear={onClear}
        />
        <div
          className={cn(
            "pointer-events-none absolute right-4 top-2 h-auto w-fit bg-transparent p-0 opacity-0",
            { "pointer-events-auto opacity-100": isDirty }
          )}
        >
          <Button
            size="M"
            variant={"primary-inverse"}
            onClick={handleSave}
            disabled={loading}
            className="w-[123px]"
          >
            {loading ? (
              <div role="status">
                <Icon
                  name={"24/Accent/Preloader"}
                  className="inline size-6 animate-spin text-gray-200"
                />
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              "Сохранить"
            )}
          </Button>
        </div>
      </div>
    );
  }
);
EditableInput.displayName = "EditableInput";

export { EditableInput };
