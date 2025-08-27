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
  title: "Shipping App",
  description: "Modern shipping and logistics management",
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
