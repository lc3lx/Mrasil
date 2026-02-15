import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers/Providers";
import Loading from "./loading";
import { LanguageProvider } from "./i18n/LanguageContext";
import { Cairo } from "@next/font/google";
const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "700"], // حسب الحاجة
});

export const metadata: Metadata = {
  title: "Marasil",
  description:
    "أول منصة شحن في العالم مدعومة بالذكاء الاصطناعي، تتيح لك مقارنة الأسعار، وطباعة البوالص، وتتبع الشحنات بسرعة وذكاء",
  keywords: [
    "شحن",
    "لوجستيات",
    "توصيل",
    "مراسل جديد",
    "شحن سريع",
    "خدمات الشحن",
    "ai for shipmeints ",
    "aramex",
    "smsa",
    "dhl",
    "redbox",
    "lamabox ",
    "spl",
    "سبل ",
    "ناقل ",
    "naqel",
    "ارامكس",
    "سلة ",
    "salla",
    "zid",
    "زد",
    "shopify",
    "woocommerce",
    "shopify theme",
    "woocommerce theme",
    "shopify development",
    "woocommerce development",
    "shopify customization",
    "woocommerce customization",
    "shopify plugins",
    "woocommerce plugins",
    "shopify development",
    "woocommerce development",
    "shopify customization",
    "woocommerce customization",
    "shopify plugins",
    "woocommerce plugins",
    "سمسا ",
    "ريدبوكس",
    "ارامكس",
    "لاما بوكس",
    "سبل",
    "ناقل",
    "naqel",
    "ارامكس",
    "سلة",
    "زد",
    "شحن سريع ",
    "شحن سريع في السعودية",
    "شحن سريع في المملكة العربية السعودية",
    "شحن سريع في المملكة العربية السعودية",
    "شحن دولي ",
    "شحن دولي في السعودية",
    "شحن دولي في المملكة العربية السعودية",
    "شحن دولي في المملكة العربية السعودية",
    "شحن من الباب الي الباب",
    "شحن من الباب الي الباب في السعودية",
    "شحن من الباب الي الباب في المملكة العربية السعودية",
    "شحن من الباب الي الباب في المملكة العربية السعودية",
    "marasil.ai",
    "trood",
    "oto",
    "بوليصة",
    "طرود",
    "طرود جديدة",
    "طرود جديدة",
    "اوتو",
    "منصة مراسيل جديدة",
    "منصة مراسيل جديدة جديدة",
    "منصة مراسيل ",
  ],
  authors: [{ name: "Marasil Jogd Team" }],
  creator: "Marasil ",
  publisher: "Marasil ",
  openGraph: {
    title: "Marasil  - خدمات الشحن المتطورة",
    description:
      "أول منصة شحن في العالم مدعومة بالذكاء الاصطناعي، تتيح لك مقارنة الأسعار، وطباعة البوالص، وتتبع الشحنات بسرعة وذكاء",
    url: "https://www.marasil.sa",
    siteName: "Marasil ",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Marasil  - خدمات الشحن المتطورة",
      },
    ],
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marasil Jogd - خدمات الشحن المتطورة",
    description:
      "أول منصة شحن في العالم مدعومة بالذكاء الاصطناعي، تتيح لك مقارنة الأسعار، وطباعة البوالص، وتتبع الشحنات بسرعة وذكاء",
    images: ["/logo.png"],
    creator: "@MarasilJogd",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={cairo.className}
    >
      <body suppressHydrationWarning>
        <Providers>
          <LanguageProvider>
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
