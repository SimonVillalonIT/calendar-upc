'use client';

import { useCalendarContext } from '../../../../context/calendar-context';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
  isWithinInterval,
} from 'date-fns';
import { cn } from '@/lib/utils';
import CalendarEvent from '../../calendar-event';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function CalendarBodyMonth() {
  const { date, events, setDate, setMode } = useCalendarContext();

  // 🔹 Rango del mes visible
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const today = new Date();

  // ✅ Recalcular y parsear fechas con useMemo
  const visibleEvents = useMemo(() => {
    const parsed = events.map((event) => ({
      ...event,
      start_date: new Date(event.start_date),
      end_date: new Date(event.end_date),
    }));

    return parsed.filter(
      (event) =>
        isWithinInterval(event.start_date, {
          start: calendarStart,
          end: calendarEnd,
        }) ||
        isWithinInterval(event.end_date, {
          start: calendarStart,
          end: calendarEnd,
        }) ||
        (event.start_date < calendarStart && event.end_date > calendarEnd)
    );
  }, [events, calendarStart, calendarEnd]);

  return (
    <div className='flex flex-grow flex-col overflow-hidden'>
      {/* Cabecera */}
      <div className='hidden grid-cols-7 divide-x divide-border border-border md:grid'>
        {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
          <div
            key={day}
            className='border-b border-border py-2 text-center text-sm font-medium text-muted-foreground'
          >
            {day}
          </div>
        ))}
      </div>

      {/* 💡 Motion sin AnimatePresence (layout inteligente) */}
      <motion.div
        layout
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className='relative grid flex-grow overflow-y-auto md:grid-cols-7'
      >
        {calendarDays.map((day) => {
          const dayEvents = visibleEvents.filter((event) =>
            isWithinInterval(day, {
              start: event.start_date,
              end: event.end_date,
            })
          );

          const isToday = isSameDay(day, today);
          const isCurrentMonth = isSameMonth(day, date);

          return (
            <div
              key={`${format(day, 'yyyy-MM-dd')}`}
              className={cn(
                'relative flex aspect-square cursor-pointer flex-col border-b border-r p-2 transition-colors hover:bg-accent/30',
                !isCurrentMonth && 'hidden bg-muted/50 md:flex'
              )}
              onClick={(e) => {
                e.stopPropagation();
                setDate(day);
                setMode('day');
              }}
            >
              {/* Número de día */}
              <div
                className={cn(
                  'flex aspect-square w-fit flex-col items-center justify-center rounded-full p-1 text-sm font-medium',
                  isToday && 'bg-primary text-background'
                )}
              >
                {format(day, 'd')}
              </div>

              {/* Eventos */}
              <div className='mt-1 flex flex-col gap-1'>
                {dayEvents.slice(0, 3).map((event) => (
                  <CalendarEvent
                    key={`${event.id}-${day.toISOString()}`}
                    event={event}
                    className='relative h-auto'
                    month
                  />
                ))}
                {dayEvents.length > 3 && (
                  <div
                    className='cursor-pointer select-none text-xs text-muted-foreground'
                    onClick={(e) => {
                      e.stopPropagation();
                      setDate(day);
                      setMode('day');
                    }}
                  >
                    +{dayEvents.length - 3} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
