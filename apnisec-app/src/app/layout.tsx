import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: 'AnhadSec - Professional Cybersecurity Solutions',
  description: 'Comprehensive cybersecurity services including Cloud Security, VAPT, and Reteam Assessments. Protect your digital assets with ApniSec.',
  keywords: ['cybersecurity', 'cloud security', 'VAPT', 'penetration testing', 'security assessment', 'vulnerability assessment'],
  authors: [{ name: 'AnhadSec' }],
  creator: 'AnhadSec',
  publisher: 'AnhadSec',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://apnisec.com',
    siteName: 'ApniSec',
    title: 'ApniSec - Professional Cybersecurity Solutions',
    description: 'Comprehensive cybersecurity services including Cloud Security, VAPT, and Reteam Assessments.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ApniSec Cybersecurity',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ApniSec - Professional Cybersecurity Solutions',
    description: 'Comprehensive cybersecurity services including Cloud Security, VAPT, and Reteam Assessments.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
  <link rel="canonical" href="https://apnisec.com" />
  <link rel="manifest" href="/manifest.json" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta httpEquiv="x-ua-compatible" content="ie=edge" />
  <meta name="theme-color" content="#4C1D95" />
</head>
      <body>{children}</body>
    </html>
  );
}