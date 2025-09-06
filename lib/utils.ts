import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from './supabase/client';
import { redirect } from 'next/navigation';
import { UserWithRole } from "@/types/globals";

export async function getUserRole() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    console.error('Profile not found for user:', user.id);
    redirect('/error'); 
  }

  return { ...user, role: profile.role, name: profile.name } as UserWithRole;
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getColorForPriority(priority?: string) {
  switch (priority) {
    case 'High':
      return 'red'
    case 'Medium':
      return 'orange'
    case 'Low':
      return 'blue'
    default:
      return 'blue'
  }
}

export function capitalizeFirstLetter(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}