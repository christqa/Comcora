import { type PropsWithChildren } from "react";

import { Icon, type IconName } from "@/components/ui/icon";

type ControlsProps = {
  controls: "Left" | "Right";
};

export function Controls(props: PropsWithChildren<ControlsProps>) {
  const { controls } = props;
  const icon = {
    Left: "24/Colored/Inverse/Left",
    Right: "24/Colored/Inverse/Right",
  }[controls] as IconName;
  return (
    <div className={"flex size-6 items-center justify-center rounded-full"}>
      <Icon
        name={icon}
        className={
          "size-6 text-icon-primary-inverse hover:text-icon-primary-inverse/80"
        }
      />
    </div>
  );
}
