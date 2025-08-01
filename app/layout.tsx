import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { Providers } from "./providers/Providers"
import Loading from "./loading"
import { LanguageProvider } from "./i18n/LanguageContext"

const inter = Inter({ subsets: ["latin"] })

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
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
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
