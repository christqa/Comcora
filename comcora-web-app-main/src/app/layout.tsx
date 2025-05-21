import "@/assets/styles/globals.css";

import localFont from "next/font/local";

const fontSuisseIntlRegular = localFont({
  src: [
    {
      path: "../assets/fonts/SuisseIntl-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/SuisseIntl-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/SuisseIntl-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-suisse",
});

export const metadata = {
  title: "Comcora bank",
  description: "Comcora - universal banking solution",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSuisseIntlRegular.className} ${fontSuisseIntlRegular.variable} bg-fill-background-main`}
      >
        {children}
      </body>
    </html>
  );
}
