import "./globals.scss";
import { Metadata } from "next";

import localFont from 'next/font/local';
import Script from 'next/script';
import { EB_Garamond } from "next/font/google";
import BackToTopCom from "./components/common/back-to-top-com";
import { ClientProviders } from "@/components/providers/ClientProviders";
import CookieConsentBanner from "./components/common/cookie-consent-banner";

const gordita = localFont({
  src: [
    {
      path: '../../public/assets/fonts/gordita/gordita_medium-webfont.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/gordita/gordita_medium-webfont.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/gordita/gordita_regular-webfont.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/gordita/gordita_regular-webfont.woff',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--gorditas-font'
})

const garamond = EB_Garamond({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--eb_garamond-font",
});

export const metadata: Metadata = {
  title: "MMV",
  description: "Make My Vid",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body suppressHydrationWarning={true} className={`${gordita.variable} ${garamond.variable}`}>
        <ClientProviders>
          {children}
          <CookieConsentBanner />
        </ClientProviders>
        <BackToTopCom />
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" />
      </body>
    </html>
  );
}
