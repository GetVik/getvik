import { Metadata } from 'next';
import { generateAuthMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateAuthMetadata('reset-password');

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
