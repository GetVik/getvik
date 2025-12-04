import { Metadata } from 'next';
import { generateAuthMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateAuthMetadata('signin');

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
