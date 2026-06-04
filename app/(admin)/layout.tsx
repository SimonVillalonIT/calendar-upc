import { getServerUserRole } from '@/lib/supabase/user';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUserRole();

  if (user?.role !== 1) {
    redirect('/');
  }

  return <>{children}</>;
}
