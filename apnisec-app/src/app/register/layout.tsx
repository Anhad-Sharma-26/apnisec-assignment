import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - AnhadSec',
  description: 'Create your AnhadSec account and start managing your cybersecurity needs.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}