import "./globals.scss";
import { Metadata } from "next";
import Head from "next/head";
import localFont from 'next/font/local';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { EB_Garamond } from "next/font/google";
import { Providers } from "@/redux/provider";
import { Toaster } from "react-hot-toast";
import { SidebarProvider } from "@/context/SidebarContext";
import { UserProvider } from "@/context/UserContext";
import { ConsentProvider } from "@/context/ConsentContext";
import { NotificationProvider } from "@/context/NotificationContext";

// Dynamic imports for components not needed on initial load
const BackToTopCom = dynamic(() => import("./components/common/back-to-top-com"), {
  ssr: false
});
const CookieConsentBanner = dynamic(() => import("./components/common/cookie-consent-banner"), {
  ssr: false
});

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
        <link rel="icon" href="/assets/images/fav-icon/MMV-Tab-Icon.png" sizes="any" />
        <link rel="icon" href="/assets/images/fav-icon/MMV-Tab-Icon.png" sizes="1024x1024" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/images/fav-icon/MMV-Tab-Icon.png" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body suppressHydrationWarning={true} className={`${gordita.variable} ${garamond.variable}`}>
        <Head>
          <title>MMV</title>
        </Head>
        <Providers>
          <ConsentProvider>
            <UserProvider>
              <SidebarProvider> {/*yaha wrap kar diya */}
                <NotificationProvider>
                  <Toaster position="top-right" />
                  {children}
                  <CookieConsentBanner />
                </NotificationProvider>
              </SidebarProvider>
            </UserProvider>
          </ConsentProvider>
        </Providers>
        <BackToTopCom />
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" />
      </body>
    </html>
  );
}
