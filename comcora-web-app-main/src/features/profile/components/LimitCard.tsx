import { type FC, type ReactElement } from "react";

import { Icon, type IconName } from "@/components/ui/icon";

type LimitCardProps = {
  title: string;
  icon: IconName;
  value: ReactElement;
};

export const LimitCard: FC<LimitCardProps> = ({ title, icon, value }) => {
  return (
    <div className="flex h-full cursor-pointer flex-col items-start justify-between rounded-2xl bg-fill-primary p-4">
      <div className="mb-8 rounded-xl bg-fill-primary-light p-1">
        <Icon name={icon} />
      </div>
      <div className="h-full text-16-medium">{title}</div>
      {value}
    </div>
  );
};
