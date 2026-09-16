import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HideOnStaff } from '@/components/staff/HideOnStaff';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2a476f',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.khmtutoring.com'),
  title: {
    default: 'Math & SAT Tutoring in Honolulu, Hawaii | KHM Tutoring',
    template: '%s | KHM Tutoring Hawaii',
  },
  description: 'Expert tutoring in Hawaii & Honolulu. Math, SAT, SSAT prep with proven results. 300+ students helped. Book your free consultation today!',
  keywords: ['hawaii tutoring', 'tutoring hawaii', 'honolulu tutoring', 'math tutoring honolulu', 'hawaii tutors', 'tutors in hawaii', 'oahu tutoring', 'honolulu math tutor', 'SAT prep hawaii', 'SSAT tutor honolulu', 'math tutor oahu', 'english tutor hawaii'],
  authors: [{ name: 'KHM Tutoring' }],
  creator: 'KHM Tutoring',
  publisher: 'KHM Tutoring',
  icons: {
    icon: { url: '/favicon.png', type: 'image/png' },
    apple: '/khm-tutoring-favicon.png',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.khmtutoring.com',
    siteName: 'KHM Tutoring',
    title: 'Math & SAT Tutoring in Honolulu, Hawaii | KHM Tutoring',
    description: 'Expert tutoring in Hawaii & Honolulu. Math, SAT, SSAT prep. 300+ students helped. Free consultation!',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KHM Tutoring - Expert Tutors in Hawaii',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Math & SAT Tutoring in Honolulu, Hawaii | KHM Tutoring',
    description: 'Expert tutoring in Hawaii & Honolulu. Math, SAT prep. 300+ students helped.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.khmtutoring.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg">Skip to content</a>
        <HideOnStaff>
          <Navigation />
        </HideOnStaff>
        <main id="main-content" className="min-h-screen">{children}</main>
        <HideOnStaff>
          <Footer />
        </HideOnStaff>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17881935420"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17881935420');
          `}
        </Script>
      </body>
    </html>
  );
}
