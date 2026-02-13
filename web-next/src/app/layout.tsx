import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono } from "next/font/google";
import Providers from "./providers";
import { ThemeScript } from "./theme-script";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "GoBrewery",
  description: "Gestão e operações da cervejaria artesanal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${fraunces.variable} ${plexMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
