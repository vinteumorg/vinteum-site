import type { Metadata } from "next";
import { Geist, Geist_Mono, Rethink_Sans, Poppins, Space_Mono, Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import { Footer, Navbar } from "./components/layout";
import { LanguageProvider } from "@/contexts/LanguageContext";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rethinkSans = Rethink_Sans({
  variable: "--font-rethink-sans",
  subsets: ["latin"],
  weight: ["400"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Vinteum",
  description: "Vinteum - Open Source Bitcoin Development",
  openGraph: {
    title: "Vinteum",
    description: "Vinteum - Open Source Bitcoin Development",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vinteum",
    description: "Vinteum - Open Source Bitcoin Development",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rethinkSans.variable} ${poppins.variable} ${spaceMono.variable} ${barlowCondensed.variable} ${inter.variable} antialiased`}
      >
        <LanguageProvider>
          <Navbar />
          <main className="overflow-x-hidden">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
