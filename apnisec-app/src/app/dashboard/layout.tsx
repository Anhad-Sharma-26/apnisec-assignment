import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - ApniSec',
  description: 'Manage your security issues and assessments.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}