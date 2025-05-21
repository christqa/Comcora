import "@/assets/styles/globals.css";

import Image from "next/image";
import Logo from "@/assets/icons/logo.svg";
import { AccountsProvider } from "@/features/account/hooks/AccountsProvider";
import AuthProvider from "@/features/login/hooks/AuthContext";
import TranslationsProvider from "@/features/translations/hooks/TranslationsProvider";
import initTranslations from "@/i18n";
import { type Locale } from "@/i18n-config";

import { DynamicInnerBackground } from "@/app/[locale]/_layout/DynamicInnerBackground";
import { Footer } from "@/app/[locale]/_layout/Footer";
import { Header } from "@/app/[locale]/_layout/Header";
import { Sidebar } from "@/app/[locale]/_layout/Sidebar";

const i18nNamespaces = ["private", "guest"];

export default async function ProfileLayout({
  children,

  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <AuthProvider>
        <div className={"relative bg-fill-background-main"}>
          <div className="container relative z-10 flex min-h-screen  min-w-[1048px] justify-center gap-x-8">
            <aside className={"grid grid-cols-4 gap-4 py-6"}>
              <div className={"col-span-4"}>
                <div
                  className={
                    "sticky top-6 col-span-4 flex flex-col items-center gap-y-4"
                  }
                >
                  <header>
                    <Image
                      src={Logo}
                      className="size-18 shrink-0 text-fill-surface-inverse"
                      alt={"logo"}
                    />
                  </header>
                  <AccountsProvider>
                    <Sidebar />
                  </AccountsProvider>
                </div>
              </div>
            </aside>

            <main className={"grid grid-cols-12-sub gap-4"}>
              <div className="col-span-12 flex flex-col gap-y-10">
                <Header />
                <div className={"flex-1"}>{children}</div>
                <Footer />
              </div>
            </main>
          </div>
          <DynamicInnerBackground />
        </div>
      </AuthProvider>
    </TranslationsProvider>
  );
}
