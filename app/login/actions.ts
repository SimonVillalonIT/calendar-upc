'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // If there's a login error, redirect to the error page.
    // This is good for handling invalid credentials.
    redirect('/error')
  }

  // Get the user's session after successful login
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Fetch the user's role from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      // Handle the case where the profile can't be found
      console.error("Error fetching user profile:", profileError)
      redirect('/error') 
    }

    // Redirect based on the user's role
    if (profile.role === 'admin') {
      revalidatePath('/admin-dashboard', 'layout')
      redirect('/admin-dashboard')
    } else {
      revalidatePath('/', 'layout')
      redirect('/')
    }
  }

  // Fallback redirect to the main page if no user is found
  revalidatePath('/', 'layout')
  redirect('/')
}