"use client";

import { useCallback, useState } from "react";
import { AppDownload } from "@/features/login/components/AppDownload";
import { ChallengeCode } from "@/features/login/components/ChallengeCode";
import { IdCardForm } from "@/features/login/components/IdCardForm";
import { MobileIdForm } from "@/features/login/components/MobileIdForm";
import { PasswordForm } from "@/features/login/components/PasswordForm";
import { SmartIdForm } from "@/features/login/components/SmartIdForm";
import { useLogin } from "@/features/login/hooks/LoginContext";
import { useTranslation } from "react-i18next";

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
import { LoaderModal } from "@/components/ui/loader-modal";
import { Overlay } from "@/components/ui/overlay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LoginWidget() {
  const { t } = useTranslation();

  const {
    progress,
    loading,
    error,
    challengeCode,
    dismissChallengeCode,
    dismissError,
  } = useLogin();

  const [activeTab, setActiveTab] = useState("smart-id");

  const handleValueChange = useCallback((v: string) => setActiveTab(v), []);

  // const query = api.auth.testSession.useQuery();
  return (
    <div className={"relative"}>
      <div className={"flex flex-col items-start gap-10 transition-opacity"}>
        <h2 className="text-center text-32-medium text-typography-primary">
          {t("auth.chooseLoginMethod")}
        </h2>
        <Tabs
          defaultValue="smart-id"
          className="w-full"
          onValueChange={handleValueChange}
        >
          <TabsList>
            <TabsTrigger value="smart-id">Smart-ID</TabsTrigger>
            <TabsTrigger value="mobile-id">Mobile-ID</TabsTrigger>
            <TabsTrigger value="id-card">
              {t("auth.loginMethods.IDCard")}
            </TabsTrigger>
            <TabsTrigger value="password">
              {t("auth.credentials.login")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="smart-id">
            <SmartIdForm />
          </TabsContent>
          <TabsContent value="mobile-id">
            <MobileIdForm />
          </TabsContent>
          <TabsContent value="id-card">
            <IdCardForm />
          </TabsContent>
          <TabsContent value="password">
            <PasswordForm />
          </TabsContent>
        </Tabs>
      </div>
      {!challengeCode && (
        <AppDownload
          className={`${activeTab === "id-card" ? "mt-[144px]" : activeTab === "password" ? "mt-[48px]" : "mt-[88px]"}`}
        />
      )}
      <Dialog
        open={Boolean(error)}
        onOpenChange={(open) => !open && dismissError()}
      >
        <DialogContent>
          <DialogHeader>
            <Icon
              className={"size-10 text-icon-critical"}
              name={"40/Crirical/Error"}
            />
            <DialogTitle>
              {/*{error?.message}*/}
              {t("auth.error.text")}
            </DialogTitle>
            <DialogDescription className="mx-auto w-4/5">
              {/*{error?.description}*/}
              {t("auth.error.authErrorMessageDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={"accent"} size={"L"} onClick={error?.retry}>
              {t("common.buttonText.tryAgain")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Overlay visible={progress}>
        {challengeCode && (
          <ChallengeCode
            value={challengeCode}
            onDismiss={dismissChallengeCode}
          />
        )}
        <LoaderModal visible={loading} />
      </Overlay>
    </div>
  );
}
