import "~/styles/globals.css";
import "~/styles/preflight.css";
import "@mantine/core/styles.css";
// import "@mantine/form/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { auth } from "~/server/auth";
import SessionProvider from "./_components/SessionProvider";
import { NavBar } from "./_components/NavBar/NavBar";
import theme from "~/styles/MantineTheme";

export const metadata: Metadata = {
  title: "Storage Manager",
  description: "App for efficiently managing your products",
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
          <MantineProvider theme={theme}>
            <SessionProvider session={session}>
              <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#333333] to-[#dd1818]">
                <div className="flex min-h-screen">
                  <NavBar />
                  <div className="flex w-full flex-col items-center justify-center">
                    {children}
                  </div>
                </div>
              </main>
            </SessionProvider>
          </MantineProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
