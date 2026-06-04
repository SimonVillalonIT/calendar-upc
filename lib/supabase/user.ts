import { createClient } from './server';
import { redirect } from 'next/navigation';
import { UserWithRole } from '@/types/globals';

export async function getServerUserRole() {
  const user = await getOptionalServerUserRole();

  if (!user) {
    redirect('/');
  }

  return user;
}

export async function getOptionalServerUserRole() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    console.error('Profile not found for user:', user.id);
    return null;
  }

  return { ...user, role: profile.role, name: profile.name } as UserWithRole;
}
