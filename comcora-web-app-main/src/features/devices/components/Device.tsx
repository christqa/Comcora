import { useMemo } from "react";
import { type TokenSessionResponse } from "@/types/auth-service.types";
import { useTranslation } from "react-i18next";

import { formatLastSeen } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { ListOption } from "@/components/ui/list-option";
import { ListOptionContent } from "@/components/ui/list-option-content";
import { Skeleton } from "@/components/ui/skeleton";
import { Thumbnail } from "@/components/ui/thumbnail";
import { Touchable } from "@/components/ui/Touchable";

type DeviceProps = {
  session?: TokenSessionResponse;
  onSessionEnd?: () => void;
};

export const Device = (props: DeviceProps) => {
  const { t } = useTranslation();
  const { session, onSessionEnd } = props;
  const { device = "Unknown", type } = useMemo(() => {
    if (!session) {
      return [];
    }
    const info = session?.device.info.split(";").map((item) => item.split("="));
    return info?.reduce(
      (acc, [key, value] = []) => {
        if (key) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string | undefined>
    );
  }, [session]) as { device?: string; type?: string };

  return (
    <ListOption>
      {!session && (
        <>
          <Skeleton className={"size-10 rounded-xl"} />
          <Skeleton className={"h-10 w-full max-w-[24rem] rounded-xl"} />
        </>
      )}

      {session && (
        <>
          <Thumbnail variant={"light"}>
            <Icon
              name={
                type === "mobile" ? "24/Primary/Phone" : "24/Primary/Laptop"
              }
            />
          </Thumbnail>
          <ListOptionContent title={device}>
            <div className={"flex items-center gap-x-1"}>
              <span
                className={
                  "whitespace-nowrap text-12-medium text-typography-primary"
                }
              >
                {session.device.geo}, {session.device.ip}
              </span>
              <Icon
                name={"interpunct"}
                className={"size-4 text-fill-secondary-active"}
              />
              <span className={"text-12-medium text-typography-secondary"}>
                {formatLastSeen(session.issuedAt, t)}
              </span>
            </div>
          </ListOptionContent>
          {!session.current && (
            <Touchable onClick={onSessionEnd}>
              <Thumbnail variant={"light"}>
                <Icon name={"24/Primary/TrashBin"} />
              </Thumbnail>
            </Touchable>
          )}
        </>
      )}
    </ListOption>
  );
};
