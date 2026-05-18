import { Fraunces, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { PHProvider } from '@/app/providers'
import CookieBanner from '@/app/components/CookieBanner'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`${fraunces.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <PHProvider>
            <Navbar />
            {children}
            <Footer />
            <CookieBanner />
          </PHProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
