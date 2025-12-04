import { Metadata } from 'next';
import { generateAboutMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateAboutMetadata();

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
