import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "AniHuaVerse",
  description: "AniHuaVerse adalah destinasi utama para pecinta animasi Asia! Kami menyajikan ribuan episode anime Jepang, donghua Tiongkok, dan koleksi manga serta manhua yang terus diperbarui. Dengan tampilan antarmuka yang ramah pengguna, sistem streaming cepat, serta dukungan subtitle Indonesia, AniHuaVerse hadir untuk memanjakan para penggemar budaya pop Asia dari berbagai kalangan. Temukan anime musiman, donghua aksi-fantasi, hingga manga klasik—semuanya di satu tempat!",
};

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
