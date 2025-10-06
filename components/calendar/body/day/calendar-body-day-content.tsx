import { useCalendarContext } from '../../../../context/calendar-context';
import { isSameDay } from 'date-fns';
import { hours } from './calendar-body-margin-day-margin';
import CalendarBodyHeader from '../calendar-body-header';
import CalendarEvent from '../../calendar-event';

export default function CalendarBodyDayContent({ date }: { date: Date }) {
  const { events } = useCalendarContext();

  const dayEvents = events.filter((event) => isSameDay(event.start_date, date));

  return (
    <div className='flex flex-grow flex-col'>
      <CalendarBodyHeader date={date} />

      <div className='relative flex-1'>
        {hours.map((hour) => (
          <div key={hour} className='group h-32 border-b border-border/50' />
        ))}

        {dayEvents.map((event) => (
          <CalendarEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
