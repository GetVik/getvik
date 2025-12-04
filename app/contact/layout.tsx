import { Metadata } from 'next';
import { generateContactMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateContactMetadata();

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
