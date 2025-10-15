'use client';
import { useUser } from '@/context/user-context';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (user?.role !== 1) {
      console.log('true');
      router.push('/');
    }
  }, [user, router, isLoading]);

  if (isLoading) return <Loader className='mx-auto mt-20 animate-spin' />;

  return <>{children}</>;
}
