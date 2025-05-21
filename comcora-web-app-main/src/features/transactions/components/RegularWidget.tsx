import { type PropsWithChildren, type ReactElement } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Thumbnail } from "@/components/ui/thumbnail";

type TransactionCategoryProps = {
  title: string;
  icon: ReactElement;
  href: string;
  className?: string;
  onClick?: () => void;
  badge?: boolean;
  count?: number;
};

export function RegularWidget(
  props: PropsWithChildren<TransactionCategoryProps>
) {
  const { title, icon, href, className, onClick, badge, count } = props;

  return (
    <Link
      href={href}
      onClick={onClick ? onClick : undefined}
      className={cn(
        `relative flex h-[8rem] w-[11rem] flex-col justify-between rounded-3xl bg-fill-primary p-4 transition delay-150 duration-200 ease-in-out hover:-translate-y-2 hover:bg-stroke-primary-light hover:shadow-lg active:border-2 active:border-stroke-secondary active:bg-fill-primary-active active:p-3.5`,
        className
      )}
    >
      {badge ? (
        <div className="relative size-fit">
          <Thumbnail variant={"light"}>{icon}</Thumbnail>
          <Badge
            variant="critical"
            className={
              "absolute -right-1 -top-1 size-[18px] items-center justify-center border-2 border-stroke-primary p-0"
            }
          >
            {count}
          </Badge>
        </div>
      ) : (
        <Thumbnail variant={"light"}>{icon}</Thumbnail>
      )}
      <span className="text-16-medium text-typography-primary">{title}</span>
    </Link>
  );
}
