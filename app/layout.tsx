import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { Providers } from "./providers/Providers"
import Loading from "./loading"
import { LanguageProvider } from "./i18n/LanguageContext"
import { Cairo } from '@next/font/google';
const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '700'], // حسب الحاجة
});

export const metadata: Metadata = {
  title: "Marasil",
  description: "منصة مراسل ججد للشحن واللوجستيات - حلول شحن متقدمة وخدمات لوجستية شاملة للشركات والأفراد",
  keywords: ["شحن", "لوجستيات", "توصيل", "مراسل ججد", "شحن سريع", "خدمات الشحن"],
  authors: [{ name: "Marasil Jogd Team" }],
  creator: "Marasil ",
  publisher: "Marasil ",
  openGraph: {
    title: "Marasil  - خدمات الشحن المتطورة",
    description: "منصة مراسل ججد للشحن واللوجستيات - حلول شحن متقدمة وخدمات لوجستية شاملة للشركات والأفراد",
    url: "https://www.marasil.site",
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
    description: "منصة مراسل ججد للشحن واللوجستيات - حلول شحن متقدمة وخدمات لوجستية شاملة للشركات والأفراد",
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={cairo.className}>
      <body  suppressHydrationWarning>
        <Providers>
          <LanguageProvider>
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  )
}
