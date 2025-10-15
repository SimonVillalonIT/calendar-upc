'use server';

import { DOMAIN } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: `${formData.get('email')}${DOMAIN}`,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
