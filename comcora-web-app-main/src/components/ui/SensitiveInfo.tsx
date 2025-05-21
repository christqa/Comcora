import { type PropsWithChildren } from "react";

import { ElementPixelated } from "@/components/ui/ElementPixelated";

type SensitiveInfoProps = {
  hidden?: boolean;
};

export const SensitiveInfo = (props: PropsWithChildren<SensitiveInfoProps>) => {
  const { hidden, children } = props;

  return hidden ? (
    <ElementPixelated>{children}</ElementPixelated>
  ) : (
    <>{children}</>
  );
};
