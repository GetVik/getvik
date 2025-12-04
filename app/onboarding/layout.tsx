import { Metadata } from 'next';
import { generateAuthMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateAuthMetadata('onboarding');

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
