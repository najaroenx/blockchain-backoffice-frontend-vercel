import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import Providers from "./provider";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { GlobalLoader } from "@/components/GlobalLoader";
import ThemeRegistry from "@/components/ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIS MARKETPLACE",
  icons: {
    icon: "/images/ais-logo.png",
    shortcut: "/images/ais-logo.png",
    apple: "/images/ais-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/ais-logo.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/ais-logo.png"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeRegistry>
          <main>
            <LoadingProvider>
              <SessionWrapper>
                <Providers>{children}</Providers>
              </SessionWrapper>
              <GlobalLoader />
            </LoadingProvider>
          </main>
        </ThemeRegistry>
      </body>
    </html>
  );
}
