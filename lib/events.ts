import { CalendarEvent } from '@/types/calendar-types';
import { createClient } from './supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { UserWithRole } from '@/types/globals';
import { Database } from '@/types/supabase.types';

const supabase = createClient();

export async function getEvents(
  user: UserWithRole | null
): Promise<{ data: CalendarEvent[] | null; error: PostgrestError | null }> {
  let response;
  if (user && user.role === 2) {
    response = await supabase.rpc('get_events_for_teacher_and_students', {
      _teacher_id: user.id,
    });
  } else if (user && user.role === 1) {
    response = await supabase.rpc('get_events_with_author');
  } else {
    response = await supabase.rpc('get_events_for_students');
  }

  const { data, error } = response;

  if (error) {
    return { data: null, error };
  }

  const parsedData = (data as any[]).map((event) => ({
    ...event,
    start_date: new Date(event.start_date.replace(' ', 'T')),
    end_date: new Date(event.end_date.replace(' ', 'T')),
  })) as CalendarEvent[];

  return { data: parsedData, error: null };
}

export async function addEvent(values: {
  end_date: string;
  start_date: string;
  title: string;
  priority: number;
  target: number;
  description: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('Usuario no autenticado.');
    throw new Error('Usuario no autenticado.');
  }

  const newEvent = {
    title: values.title,
    description: values.description,
    start_date: values.start_date,
    end_date: values.end_date,
    priority: values.priority,
    target: values.target,
    created_by: user.id,
  };
  const { error } = await supabase.from('events').insert([newEvent]);

  return error;
}

export async function editEvent(
  id: string,
  values: {
    end_date: string;
    start_date: string;
    title: string;
    priority: number;
    target: number;
    description?: string | undefined;
  }
) {
  const { error } = await supabase.from('events').update(values).eq('id', id);

  return error;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase.from('events').delete().eq('id', id);

  return error;
}
