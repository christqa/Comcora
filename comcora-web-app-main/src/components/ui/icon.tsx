import { type SVGProps } from "react";
import { type IconName } from "@/types/name";

import { cn } from "@/lib/utils";

export { type IconName };

export function Icon({
  name,
  childClassName,
  className,
  children,
  ...props
}: SVGProps<SVGSVGElement> & {
  name: IconName;
  childClassName?: string;
}) {
  if (children) {
    return (
      <span
        className={cn(`font inline-flex items-center gap-1.5`, childClassName)}
      >
        <Icon
          name={name}
          className={cn(className, "test-burger text-typography-primary")}
          {...props}
        />
        {children}
      </span>
    );
  }
  return (
    <svg {...props} className={cn("inline size-6 self-center", className)}>
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  );
}
