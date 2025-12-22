import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - AnhadSec',
  description: 'Login to your AnhadSec account to manage your cybersecurity issues.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}