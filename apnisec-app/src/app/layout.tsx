import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: 'ApniSec - Cybersecurity Solutions',
  description: 'Professional cybersecurity services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}