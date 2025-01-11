import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import { Lora, Poppins } from 'next/font/google';
import { WebDetails } from '../configs';
import NextTopLoader from "nextjs-toploader";
import Providers from "./providers";
import { getSession } from "./auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: WebDetails.webName,
  description: WebDetails.webMeta.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} ${poppins.variable}`}>
        <Providers session={session}>
          <NextTopLoader color="var(--theme-main)" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
