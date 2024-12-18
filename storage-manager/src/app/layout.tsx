import "~/styles/globals.css";
import "@mantine/core/styles.css";
// import "@mantine/form/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { auth } from "~/server/auth";
import SessionProvider from "./_components/SessionProvider";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <TRPCReactProvider>
          <MantineProvider
            theme={{
              primaryColor: "teal",
            }}
          >
            <SessionProvider session={session}>{children}</SessionProvider>
          </MantineProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
