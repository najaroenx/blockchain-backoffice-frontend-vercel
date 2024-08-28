import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kiwari Lab Loyalty Program",
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
        <body className={inter.className}>{children}</body>
      </StyledEngineProvider>
    </html>
  );
}
