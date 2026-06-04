import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo';
import { getSiteUrl } from '@/lib/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Khiva tours, excursions, and Uzbekistan travel packages from a local Khiva travel agency.',
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/brand/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`} suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
