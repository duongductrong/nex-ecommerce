import NextThemeProvider from "@/components/theme-provider"
import TrpcProvider from "@/components/trpc-provider"
import { Toaster } from "@/components/ui/toaster"
import { LOCALES } from "@/constant/locales"
import { NextIntlClientProvider, createTranslator } from "next-intl"
import { Inter } from "next/font/google"
import { notFound } from "next/navigation"
import { ReactNode } from "react"
import "../globals.css"
import AuthProvider from "@/components/auth-provider/auth-provider"

export interface RootLayoutProps {
  children: ReactNode
  params: { locale: string }
}

const inter = Inter({ subsets: ["latin"] })

export async function getDirectories(locale: string) {
  try {
    return (await import(`../../../directories/${locale}.json`)).default
  } catch (error) {
    notFound()
  }
}

// export async function generateStaticParams() {
//   return Object.values(LOCALES).map((locale) => ({ locale }))
// }

export async function generateMetadata({
  params: { locale },
}: RootLayoutProps) {
  const messages = await getDirectories(locale)

  // You can use the core (non-React) APIs when you have to use next-intl
  // outside of components. Potentially this will be simplified in the future
  // (see https://next-intl-docs.vercel.app/docs/next-13/server-components).
  const t = createTranslator({ locale, messages })

  return {
    title: t("PAGE_INFO.TITLE"),
  }
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  const directories = await getDirectories(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <TrpcProvider>
          <NextThemeProvider>
            <NextIntlClientProvider locale={locale} messages={directories}>
              <AuthProvider>{children}</AuthProvider>
              <Toaster />
            </NextIntlClientProvider>
          </NextThemeProvider>
        </TrpcProvider>
      </body>
    </html>
  )
}
