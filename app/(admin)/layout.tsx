'use client';
import { useUser } from '@/context/user-context';
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

  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
}
