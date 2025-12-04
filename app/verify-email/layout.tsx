import { Metadata } from 'next';
import { generateAuthMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateAuthMetadata('verify-email');

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
