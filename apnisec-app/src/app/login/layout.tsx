import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - ApniSec',
  description: 'Login to your ApniSec account to manage your cybersecurity issues.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}