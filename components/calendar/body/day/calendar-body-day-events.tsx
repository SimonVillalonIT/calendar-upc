import { getColorForPriority } from '@/lib/utils';
import { useCalendarContext } from '../../../../context/calendar-context';
import { isSameDay } from 'date-fns';

export default function CalendarBodyDayEvents() {
  const { events, date, setManageEventDialogOpen, setSelectedEvent } =
    useCalendarContext();
  const dayEvents = events.filter((event) => isSameDay(event.start_date, date));

  return !!dayEvents.length ? (
    <div className='flex flex-col gap-2'>
      <p className='font-heading p-2 pb-0 font-medium'>Eventos</p>
      <div className='flex flex-col gap-2'>
        {dayEvents.map((event) => (
          <div
            key={event.id}
            className='flex cursor-pointer items-center gap-2 px-2'
            onClick={() => {
              setSelectedEvent(event);
              setManageEventDialogOpen(true);
            }}
          >
            <div className='flex items-center gap-2'>
              <div
                className={`size-2 rounded-full bg-${getColorForPriority(event.priority)}-500`}
              />
              <p className='text-sm font-medium text-muted-foreground'>
                {event.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className='p-2 text-muted-foreground'>No hay eventos hoy...</div>
  );
}
