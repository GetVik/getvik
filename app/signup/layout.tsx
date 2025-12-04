import { Metadata } from 'next';
import { generateAuthMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateAuthMetadata('signup');

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
