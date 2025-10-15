'use client';

import { useCallback, useEffect, useState } from 'react';
import { CalendarEvent, Mode } from '../types/calendar-types';
import { getEvents } from '@/lib/events';
import { useUser } from '@/context/user-context';
import Calendar from '@/components/calendar/calendar';
import { Loader } from 'lucide-react';

export default function CalendarDemo() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [mode, setMode] = useState<Mode>('month');
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  const { user, isLoading } = useUser();

  const fetchEvents = useCallback(
    async () => {
      if (isLoading) return;

      setLoading(true);
      try {
        const { data, error } = await getEvents(user);
        if (data) {
          setEvents(data);
        } else {
          console.log(error);
          setEvents([]);
        }
      } catch (error) {
        console.log(error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    },
    [user, isLoading]
  );

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return loading ? (
    <Loader className="animate-spin mx-auto mt-20" />
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