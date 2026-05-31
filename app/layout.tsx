import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Khiva Shodlik Travel',
    template: '%s | Khiva Shodlik Travel',
  },
  description: 'Professional tours from Khiva to the Aral Sea - Discover Uzbekistan with us',
  openGraph: {
    type: 'website',
    siteName: 'Khiva Shodlik Travel',
    locale: 'en_US',
    alternateLocale: ['ru_RU', 'uz_UZ'],
  },
  icons: {
    icon: [
      { url: '/brand/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/brand/apple-touch-icon.png',
    shortcut: '/brand/favicon-32.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
