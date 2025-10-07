'use client';

import { useCallback, useEffect, useState } from 'react';
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

  // 1. Usar useCallback para memoizar la función fetchEvents
  const fetchEvents = useCallback(
    async () => {
      // getEvents, setLoading, setEvents y console.log son estables
      // (vienen de props/imports o de useState, que son estables)
      // Los únicos que cambian son user y isLoading.

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
    // 2. Definir las dependencias.
    // getEvents no se pone porque es una función importada que no cambia.
    // setEvents y setLoading son funciones de setState y son estables por defecto.
    // Solo necesitamos user e isLoading.
    [user, isLoading]
  );

  useEffect(() => {
    // 3. Llamar la función memoizada
    fetchEvents();
  }, [fetchEvents]); // <-- La dependencia de useEffect ahora es fetchEvents

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
