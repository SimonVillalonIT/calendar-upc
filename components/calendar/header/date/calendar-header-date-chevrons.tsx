import { Button } from '@/components/ui/button';
import { useCalendarContext } from '../../../../context/calendar-context';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  addDays,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { capitalizeFirstLetter } from '@/lib/utils';

export default function CalendarHeaderDateChevrons() {
  const { mode, date, setDate } = useCalendarContext();

  function handleDateBackward() {
    switch (mode) {
      case 'month':
        setDate(subMonths(date, 1));
        break;
      case 'week':
        setDate(subWeeks(date, 1));
        break;
      case 'day':
        setDate(subDays(date, 1));
        break;
    }
  }

  function handleDateForward() {
    switch (mode) {
      case 'month':
        setDate(addMonths(date, 1));
        break;
      case 'week':
        setDate(addWeeks(date, 1));
        break;
      case 'day':
        setDate(addDays(date, 1));
        break;
    }
  }

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='outline'
        className='h-7 w-7 p-1'
        onClick={handleDateBackward}
      >
        <ChevronLeft className='min-h-5 min-w-5' />
      </Button>

      <span className='min-w-[140px] text-center font-medium'>
        {capitalizeFirstLetter(format(date, 'MMMM d, yyyy', { locale: es }))}
      </span>

      <Button
        variant='outline'
        className='h-7 w-7 p-1'
        onClick={handleDateForward}
      >
        <ChevronRight className='min-h-5 min-w-5' />
      </Button>
    </div>
  );
}
