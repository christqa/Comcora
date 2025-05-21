import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const AutoGrowInput = ({ ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  const { value, handleChange, className } = props;
  const [inputValue, setInputValue] = useState<string>(
    value ? value.toString() : ""
  );

  useEffect(() => {
    const input = inputRef.current;
    const span = spanRef.current;

    if (input && span) {
      span.textContent = input.value || input.placeholder || "";
      input.style.width = `${span.offsetWidth + 1}px`;
    }
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    newValue = newValue.replace(/[^0-9.]/g, "");

    if (newValue.indexOf(".") !== newValue.lastIndexOf(".")) {
      newValue = newValue.substring(0, newValue.lastIndexOf(".") + 1);
    }

    setInputValue(newValue);
    handleChange(newValue);
  };

  return (
    <>
      <Input
        {...props}
        isPlaceholderNotTransformed
        autoFocus
        ref={inputRef}
        type={"text"}
        placeholder="0"
        className={cn(
          "min-w-[32px] cursor-text rounded-none border-0 bg-transparent p-0 text-32-medium caret-fill-primary-success focus:bg-transparent",
          className
        )}
        value={inputValue}
        onChange={handleInputChange}
      />
      <span
        ref={spanRef}
        className="invisible absolute inline-block min-w-[32px] whitespace-pre pl-1"
      />
    </>
  );
};

export default AutoGrowInput;
