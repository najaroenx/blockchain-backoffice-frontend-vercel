import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SessionWrapper from "@/components/SessionWrapper";
import Providers from "./provider";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { GlobalLoader } from "@/components/GlobalLoader";

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
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <body className={inter.className}>
          <header>
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
          </header>
          <main>
            <LoadingProvider>
              <SessionWrapper>
                <Providers>{children}</Providers>
              </SessionWrapper>
              <GlobalLoader />
            </LoadingProvider>
          </main>
        </body>
      </StyledEngineProvider>
    </html>
  );
}
