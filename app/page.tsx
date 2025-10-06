'use client';

import { useEffect, useState } from 'react';
import { CalendarEvent, Mode } from '../types/calendar-types';
import { getEvents } from '@/lib/events';
import { useUser } from '@/context/user-context';
import Calendar from '@/components/calendar/calendar';

export default function CalendarDemo() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [mode, setMode] = useState<Mode>('month');
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  const { user, isLoading } = useUser();

  useEffect(() => {
    async function fetchEvents() {
      if (isLoading) return;
      setLoading(true);
      try {
        const { data, error } = await getEvents(user);
        if (data) {
          setEvents(data);
        } else {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [user, isLoading]);

  return loading ? (
    'Loading ...'
  ) : (
    <Calendar
      events={events}
      setEvents={setEvents}
      mode={mode}
      setMode={setMode}
      date={date}
      setDate={setDate}
    />
  );
}
