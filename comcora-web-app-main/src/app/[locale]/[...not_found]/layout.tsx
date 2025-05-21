import "@/assets/styles/globals.css";

import { type Locale } from "@/i18n-config";

import GuestLayout from "../_layout/GuestLayout";

const i18nNamespaces = ["guest"];

export default async function LoginLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  return <GuestLayout className="items-center">{children}</GuestLayout>;
}
