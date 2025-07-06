import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import Providers from "@/base/routing/Provider";

import Pathname from "@/base/routing/Pathname";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


import { metadata } from "@/base/meta/Metadata";

export { metadata };

metadata.manifest = "/manifest.json";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Pathname>
            {children}
          </Pathname>
        </Providers>
      </body>
    </html>
  );
}
