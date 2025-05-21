"use client";

import { useState } from "react";
import { Device } from "@/features/devices/components/Device";
import { useDevices } from "@/features/devices/hooks/DevicesContext";
import { ChangePinFlow } from "@/features/login/components/ChangePinFlow";
import { type TokenSessionResponse } from "@/types/auth-service.types";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { SectionTitle } from "@/components/ui/SectionTitle";

export const SettingsTab = () => {
  const { t } = useTranslation();
  const { endSession, endAllSessions, data, sessionsFetched } = useDevices();

  const [targetSession, setTargetSession] =
    useState<TokenSessionResponse | null>(null);

  const [terminateAllDialog, setTerminateAllDialog] = useState(false);

  const currentDevice = data?.find((ses) => ses.current);
  const otherDevices =
    data
      ?.filter((ses) => !ses.current)
      .sort(
        (a, b) =>
          new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
      ) ?? [];

  return (
    <div className={"mt-10 flex flex-col gap-y-10"}>
      <div className="flex flex-col gap-y-4">
        <span className="text-24-medium text-typography-primary">
          {t("profile.settings.loginProfile")}
        </span>
        <ChangePinFlow></ChangePinFlow>
      </div>
      <div className="flex flex-col gap-y-4">
        <span className="text-24-medium text-typography-primary">
          {t("profile.settings.devices")}
        </span>
        <div
          className={cn(
            "flex flex-col rounded-2xl bg-fill-primary py-4",
            otherDevices.length === 0 && "pb-0"
          )}
        >
          <>
            <SectionTitle className={"px-4"}>
              {t("profile.settings.deviceView.thisDevice")}
            </SectionTitle>
            <Device session={currentDevice} />
          </>

          <SectionTitle className={"mt-4 px-4"}>
            {t("profile.settings.deviceView.activeSessions")}
          </SectionTitle>
          {!sessionsFetched &&
            Array.from({ length: 4 }).map((_, i) => (
              <Device key={`skeleton-${i}`} />
            ))}

          {otherDevices.length > 0 && (
            <>
              {otherDevices.map((session) => (
                <Device
                  key={session.sessionId}
                  session={session}
                  onSessionEnd={() => setTargetSession(session)}
                />
              ))}

              <div className={"mt-4 w-full px-4"}>
                <Button
                  variant={"secondary-critical"}
                  className={"w-full"}
                  onClick={() => setTerminateAllDialog(true)}
                >
                  {t("profile.settings.deviceView.endAllSessions")}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <Dialog
        open={Boolean(targetSession)}
        onOpenChange={(open) => !open && setTargetSession(null)}
      >
        <DialogContent className={"w-[400px]"}>
          <DialogHeader>
            <Icon className={"size-10"} name={"40/Success/Check"} />
            <DialogTitle>
              {t("profile.settings.deviceView.approveAction")}
            </DialogTitle>
            <DialogDescription>
              {t("profile.settings.deviceView.endSessionForThisDevice")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"secondary-critical"}
              size={"L"}
              onClick={() =>
                targetSession &&
                endSession(targetSession?.sessionId).then(() => {
                  setTargetSession(null);
                })
              }
            >
              {t("profile.settings.deviceView.end")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={terminateAllDialog}
        onOpenChange={(open) => setTerminateAllDialog(open)}
      >
        <DialogContent>
          <DialogHeader>
            <Icon className={"size-10"} name={"40/Success/Check"} />
            <DialogTitle>
              {t("profile.settings.deviceView.approveAction")}
            </DialogTitle>
            <DialogDescription>
              {t("profile.settings.deviceView.endAllExceptThisDevice")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"secondary-critical"}
              size={"L"}
              onClick={() =>
                endAllSessions().then(() => {
                  setTerminateAllDialog(false);
                })
              }
            >
              {t("profile.settings.deviceView.end")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
