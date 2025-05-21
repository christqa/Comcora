"use client";

import { redirect } from "next/navigation";
import ConfirmationProvider from "@/features/confirmation/hooks/ConfirmationContext";
import { DevicesProvider } from "@/features/devices/hooks/DevicesContext";
import { AgreementsTab } from "@/features/profile/components/AgreementsTab";
import { PersonalTab } from "@/features/profile/components/PersonalTab";
import ProfileProvider from "@/features/profile/components/ProfileContext";
import { SettingsTab } from "@/features/profile/components/SettingsTab";
import { TariffLimitsTab } from "@/features/profile/components/TariffLimitsTab";
import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PageProps = {
  params: { slug: string };
};

const SettingsPage = (props: PageProps) => {
  const { t } = useTranslation();
  const {
    params: { slug },
  } = props;
  const allowedSettings = ["personal", "settings", "agreements", "limits"];

  !allowedSettings.includes(slug) && redirect("/private/profile/personal");

  const onTabChange = (tabName: string) => {
    window.history.replaceState(null, "", "/private/profile/" + tabName);
  };

  return (
    <Tabs
      defaultValue={allowedSettings.includes(slug) ? slug : "personal"}
      onValueChange={onTabChange}
    >
      <TabsList>
        <TabsTrigger value="personal">
          {t("profile.personalDetails.title")}
        </TabsTrigger>
        <TabsTrigger value="settings">
          {t("profile.settings.title")}
        </TabsTrigger>
        <TabsTrigger value="agreements">
          {t("profile.personalDetails.links.myAgreements")}
        </TabsTrigger>
        <TabsTrigger value="limits">
          {t("profile.personalDetails.links.tariffLimits")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="personal">
        <ConfirmationProvider>
          <ProfileProvider>
            <PersonalTab />
          </ProfileProvider>
        </ConfirmationProvider>
      </TabsContent>
      <TabsContent value="settings">
        <DevicesProvider>
          <SettingsTab />
        </DevicesProvider>
      </TabsContent>
      <TabsContent value="agreements">
        <AgreementsTab />
      </TabsContent>
      <TabsContent value="limits">
        <TariffLimitsTab />
      </TabsContent>
    </Tabs>
  );
};

export default SettingsPage;
