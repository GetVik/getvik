import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { redirect } from 'next/navigation';
import { OnboardingForm } from '@/components/forms/OnBoardingForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become a Creator',
};

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  // If the user is not logged in, send them to the login page
  if (!session) {
    redirect('/signin');
  }

  // If the user is already a creator, send them to their dashboard
  if (session.user.role === 'Creator') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] p-4">
      <OnboardingForm />
    </div>
  );
}