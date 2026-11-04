import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

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
  description: "Explore, test, and integrate with 5 live MCP APIs across the bookchaowalit portfolio — an interactive playground, endpoint docs, and code examples.",
  keywords: ['DevHub', 'MCP', 'API playground', 'Chaowalit Greepoke', 'developer portal'],
  authors: [{ name: 'Chaowalit Greepoke', url: 'https://bookchaowalit.com' }],
  creator: 'Chaowalit Greepoke',
  publisher: 'Chaowalit Greepoke',
  metadataBase: new URL('https://bookchaowalit-devhub-frontend.vercel.app'),
  alternates: {
    canonical: 'https://bookchaowalit-devhub-frontend.vercel.app',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bookchaowalit-devhub-frontend.vercel.app',
    title: 'DevHub — API Developer Portal',
    description: 'Explore, test, and integrate with 5 live MCP APIs across the bookchaowalit portfolio.',
    siteName: 'DevHub',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DevHub — API Developer Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevHub — API Developer Portal',
    description: 'Explore, test, and integrate with 5 live MCP APIs across the bookchaowalit portfolio.',
    images: ['/og-image.png'],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${notoSansThai.variable}`}>
      <body className="antialiased">
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {/* THESIS: DevHub is a tactile API routing layer, not a generic SaaS dashboard. OWN-WORLD: dark silk, tensioned gold cords, and a quiet request console turn service discovery into a physical fabric. STORY: find a line, read its contract, run the request. FIRST VIEWPORT: name the portal, show a real request shape, and point directly to the playground. FORM: seed 505a76e5 / assigned textile drawcord direction, used as restrained cable geometry and material contrast. FINISH: warm metallic signal, hairline rules, compact mono labels, and no invented health claims. */}
        <Analytics />
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}

// SEO TODO: Add Open Graph tags for social sharing
