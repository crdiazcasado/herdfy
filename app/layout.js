import { Fraunces, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PHProvider } from './providers'
import CookieBanner from './components/CookieBanner'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

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