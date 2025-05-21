"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/login/hooks/useAuth";
import { api } from "@/features/trpc-client/hooks/react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";

export function LoginWithQr() {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const { onLogin } = useAuth();
  const { mutateAsync: requestQrCode } = api.auth.requestQrCode.useMutation();
  const { mutateAsync: authenticateQrCode } =
    api.auth.authenticateQrCode.useMutation();

  const [qrUrl, setQrUrl] = useState<string>();

  const status = useRef(false);
  const openStatus = useRef(false);
  const sessionId = useRef("");

  const makeAttempt = useCallback(async (): Promise<{
    success: boolean;
    status?: "EXPIRED";
    data_url?: string;
  }> => {
    if (openStatus.current && !status.current) {
      status.current = true;
      try {
        if (!sessionId.current) {
          const intRequest = await requestQrCode();
          sessionId.current = intRequest.sessionId;
          setQrUrl(intRequest.data_url);
        }
        return authenticateQrCode({ sessionId: sessionId.current });
      } catch (e) {
        status.current = false;
        if (!openStatus.current) {
          return {
            success: false,
          };
        }
        return new Promise((r) =>
          setTimeout(() => {
            r(makeAttempt());
          }, 2000)
        );
      }
    } else {
      status.current = false;
      return Promise.resolve({ success: false });
    }
  }, []);

  const onAttemptResult = (result: { success: boolean; data_url?: string }) => {
    if (result.success) {
      status.current = false;
      sessionId.current = "";
      setOpen(false);
      onLogin();
    } else {
      if (result.data_url) {
        status.current = false;
        setQrUrl(result.data_url);
        return new Promise((r) =>
          setTimeout(() => {
            r(makeAttempt().then(onAttemptResult));
          }, 2000)
        );
      }
      status.current = false;
      sessionId.current = "";
      setOpen(false);
    }
  };

  useEffect(() => {
    openStatus.current = open;
    if (open && !status.current) {
      void makeAttempt().then(onAttemptResult);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild={true}>
        <Button variant="primary" size="L" type={"button"}>
          <Icon
            name={"24/Primary/QRCode"}
            className="size-6 shrink-0 text-typography-primary"
          />
          {t("auth.loginQR.name")}
        </Button>
      </DialogTrigger>
      <DialogContent className={"w-[400px] gap-y-8"}>
        <DialogHeader>
          <DialogTitle>{t("auth.loginQR.name")}</DialogTitle>
          <div className={"size-48 overflow-hidden rounded-2xl"}>
            {qrUrl ? (
              <img src={qrUrl} className={"shrink-0size-full"} alt="" />
            ) : (
              <Skeleton
                className={
                  "flex size-48 items-center justify-center rounded-2xl "
                }
              >
                <Icon
                  className={"size-10 shrink-0 animate-spin"}
                  name={"40/Accent/Preloader"}
                />
              </Skeleton>
            )}
          </div>
          <DialogDescription>
            {t("auth.loginQR.codeScan")} <br />
            {t("auth.loginQR.onPhone")}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
