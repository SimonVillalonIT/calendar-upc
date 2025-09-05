import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, password, role, name } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    // Insert the user's role and name into the profiles table.
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({ id: user?.id, role, name, email });

    if (profileError) {
      if (user && user.id) {
        await supabaseAdmin.auth.admin.deleteUser(user.id);
      }
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'User created successfully.', userId: user?.id }, { status: 200 });

  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}