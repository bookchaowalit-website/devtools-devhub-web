import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Self-hosted Noto Sans Thai (OFL, see src/app/fonts/OFL.txt): no runtime font CDN.
const notoSansThai = localFont({
  src: [
    { path: "./fonts/NotoSansThai-Variable.woff2", weight: "400", style: "normal" },
    { path: "./fonts/NotoSansThai-Variable.woff2", weight: "600", style: "normal" },
    { path: "./fonts/NotoSansThai-Variable.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevHub — API Developer Portal by Chaowalit Greepoke",
  description: "Explore, test, and integrate with 5 MCP APIs across the bookchaowalit portfolio — an interactive playground, endpoint docs, and code examples.",
  keywords: ['DevHub', 'MCP', 'API playground', 'Chaowalit Greepoke', 'developer portal'],
  authors: [{ name: 'Chaowalit Greepoke', url: 'https://bookchaowalit.com' }],
  creator: 'Chaowalit Greepoke',
  publisher: 'Chaowalit Greepoke',
  metadataBase: new URL('https://devhub.bookchaowalit.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://devhub.bookchaowalit.com',
    title: 'DevHub — API Developer Portal',
    description: 'Explore, test, and integrate with 5 MCP APIs across the bookchaowalit portfolio.',
    siteName: 'DevHub',
  },
  twitter: {
    card: 'summary',
    title: 'DevHub — API Developer Portal',
    description: 'Explore, test, and integrate with 5 MCP APIs across the bookchaowalit portfolio.',
    creator: '@bookchaowalit',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // The font variables sit on <html>: the Reader shell tokens live on :root and read them from there.
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${notoSansThai.variable}`}>
      <body>{children}</body>
    </html>
  );
}
