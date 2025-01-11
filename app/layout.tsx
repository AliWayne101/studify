import type { Metadata } from "next";
import "./globals.scss";
import { Poppins } from 'next/font/google';
import { WebDetails } from '../configs';
import NextTopLoader from "nextjs-toploader";
import Providers from "./providers";
import { getSession } from "./auth";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: WebDetails.webName,
  description: WebDetails.webMeta.description,
  authors: WebDetails.webMeta.authors,
  keywords: WebDetails.webMeta.keywords,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <Providers session={session}>
          <NextTopLoader color="var(--theme-main)" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
