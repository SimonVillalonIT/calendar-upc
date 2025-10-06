import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { es } from 'date-fns/locale';

export const hours = Array.from({ length: 24 }, (_, i) => i);

export default function CalendarBodyMarginDayMargin({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        'sticky left-0 z-10 flex w-12 flex-col bg-background',
        className
      )}
    >
      <div className='sticky left-0 top-0 z-20 h-[33px] border-b bg-background' />
      <div className='sticky left-0 z-10 flex w-12 flex-col bg-background'>
        {hours.map((hour) => (
          <div key={hour} className='relative h-32 first:mt-0'>
            {hour !== 0 && (
              <span className='absolute -top-2.5 left-2 text-xs text-muted-foreground'>
                {format(new Date().setHours(hour, 0, 0, 0), 'h a', {
                  locale: es,
                })}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
