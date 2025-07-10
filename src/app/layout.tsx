import type { Metadata } from "next";
import {
  IBM_Plex_Sans_Arabic,
  Amiri,
  Kufam,
  Aref_Ruqaa,
} from "next/font/google";
import "./global.css";
import Header from "@/components/layout/Header";
// import FooterCounter from "@/components/layout/FooterCounter";
// import { PagesProvider } from "@/context/PagesContext";

const IBMPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-IBMPlexSansArabic",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["latin", "arabic"],
  weight: ["400", "700"],
});

const kufam = Kufam({
  variable: "--font-readex-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ArefRuqaa = Aref_Ruqaa({
  variable: "--font-aref-ruqaa",
  subsets: ["latin", "arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "موقع الروضة الإسلامي",
    template: "%s | Rawdah Islamic Site",
  },
  description:
    "موقع الروضة الإسلامي هو موقع يهدف إلى تقديم محتوى إسلامي متنوع وشامل، يشمل مقالات، كتب، وأبحاث في مختلف مجالات العلوم الشرعية.",
  icons: {
    icon: "/web-app-manifest-512x512.png",
  },
  openGraph: {
    title: "موقع الروضة الإسلامي",
    description:
      "موقع الروضة الإسلامي هو موقع يهدف إلى تقديم محتوى إسلامي متنوع وشامل، يشمل مقالات، كتب، وأبحاث في مختلف مجالات العلوم الشرعية.",
    url: "https://r5.al-rawdah.net",
    siteName: "موقع الروضة الإسلامية",
    images: [
      {
        url: "/web-app-manifest-512x512.png", // Replace with your OG image
        width: 800,
        height: 420,
        alt: "موقع الروضة الإسلامية",
      },
    ],
    locale: "ar_SA",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://r5.al-rawdah.net"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${IBMPlexSansArabic.variable} ${amiri.variable} ${kufam.variable} ${ArefRuqaa.variable}`}
      >
        {/* <PagesProvider> */}
        <Header />
        {/* Add top padding to account for fixed header */}
        <main className="mt-20">{children}</main>
        {/* <footer className="py-10 text-center text-md text-light-span">
            <FooterCounter />
            </footer> */}
        {/* </PagesProvider> */}
        <p className="px-5 pt-10 pb-5 md:text-xl text-sm text-center">
          جميع الحقوق محفوظة لموقع الروضة الإسلامي 1446هـ - 2025م
        </p>
      </body>
    </html>
  );
}
