import { Fraunces, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PHProvider } from './providers'
import CookieBanner from './components/CookieBanner'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export const metadata = {
  title: 'Herdfy',
  description: 'Herdfy es la plataforma donde la ciudadanía se organiza para ser escuchada. Sin burocracia, sin barreras.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://herdfy.com'),
  openGraph: {
    title: 'Herdfy',
    description: 'Herdfy es la plataforma donde la ciudadanía se organiza para ser escuchada. Sin burocracia, sin barreras.',
    url: '/',
    siteName: 'Herdfy',
    images: [
      {
        url: '/sheep-hero-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Herdfy - La plataforma ciudadana',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Herdfy',
    description: 'Herdfy es la plataforma donde la ciudadanía se organiza para ser escuchada. Sin burocracia, sin barreras.',
    images: ['/sheep-hero-1.jpg'],
  },
}

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${fraunces.variable} ${geistMono.variable} antialiased`}>
        <PHProvider>
          <Navbar />
          {children}
          <Footer />
          <CookieBanner />
        </PHProvider>
      </body>
    </html>
  );
}