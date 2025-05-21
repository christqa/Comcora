import { countriesListData } from "@/features/limits/helpers/constants";
import { cva } from "class-variance-authority";

import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/icon";

type PageProps = {
  avatar?: string;
  name: string;
  country?: string;
  status?: string;
  size: "small" | "large";
  id?: string;
  showLabel?: boolean;
  selected?: boolean;
  type?: string;
  isWithinOwnAccounts?: boolean;
  colorType?: string;
  className?: string;
  isCustomer?: boolean;
  avatarSize?: "S" | "M" | "L" | "XL" | "XXL";
  avatarClassName?: string;
  avatarTextClassName?: string;
  avatarStatusSize?: "S" | "M";
};

const inputVariants = cva("", {
  variants: {
    size: {
      small:
        "w-18 [&>.avatar]:size-18 [&>.avatar]:rounded-3xl [&>div>img]:rounded-3xl",
      large:
        "w-24 [&>.avatar]:size-24 [&>.avatar]:rounded-4xl [&>div>img]:rounded-4xl",
    },
  },
});

export default function User({
  avatar,
  name,
  country,
  status,
  id,
  size,
  showLabel = true,
  selected,
  type,
  isWithinOwnAccounts,
  colorType = "secondary",
  className,
  isCustomer,
  avatarSize,
  avatarClassName,
  avatarTextClassName,
  avatarStatusSize,
}: PageProps) {
  const flag = countriesListData.find((item) => item.code === country)?.flag;

  return (
    <div
      className={`flex flex-col gap-y-2.5 ${inputVariants({ size })} ${className}`}
      key={id}
    >
      <div
        className={`avatar bg-fill-${colorType} relative flex items-center justify-center shadow-m ${selected ? "border-2 border-fill-primary-success" : ""}`}
      >
        {isWithinOwnAccounts ? (
          <Icon name={"24/Primary/RoundAltArrowHalf"} />
        ) : type === "AtmWithdrawal" ? (
          <Icon name={"24/Primary/CashOut"} />
        ) : country ? (
          <span className="text-[24px]">{flag}</span>
        ) : (
          <Avatar
            src={avatar}
            showBadge={isCustomer}
            size={avatarSize}
            alt={name}
            className={avatarClassName}
            textClassName={avatarTextClassName}
            statusSize={avatarStatusSize}
          />
        )}
        {status === "online" ? (
          <div className="absolute bottom-0 right-0 size-4 rounded-full border-[3px] border-fill-primary-light bg-fill-accent" />
        ) : null}
      </div>
      {showLabel ? (
        <p className="line-clamp-2 text-center text-12-medium text-typography-primary">
          {name}
        </p>
      ) : null}
    </div>
  );
}
