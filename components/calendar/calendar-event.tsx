import { CalendarEvent as CalendarEventType } from '@/types/calendar-types';
import { useCalendarContext } from '@/context/calendar-context';
import {
  format,
  isSameDay,
  isSameMonth,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { cn, getColorForPriority } from '@/lib/utils';
import { motion, MotionConfig, AnimatePresence } from 'framer-motion';

interface EventPosition {
  left: string;
  width: string;
  top: string;
  height: string;
}

function getOverlappingEvents(
  currentEvent: CalendarEventType,
  events: CalendarEventType[],
  currentDate?: Date
): CalendarEventType[] {
  const getEffectiveRange = (e: CalendarEventType) => {
    const start =
      currentDate && !isSameDay(e.start_date, currentDate)
        ? new Date(new Date(currentDate).setHours(0, 0, 0, 0))
        : e.start_date;
    const end =
      currentDate && !isSameDay(e.end_date, currentDate)
        ? new Date(new Date(currentDate).setHours(23, 59, 59, 999))
        : e.end_date;
    return { start, end };
  };

  const currentRange = getEffectiveRange(currentEvent);

  return events.filter((event) => {
    if (event.id === currentEvent.id) return false;

    const eventRange = getEffectiveRange(event);

    return (
      currentRange.start < eventRange.end && currentRange.end > eventRange.start
    );
  });
}

function calculateEventPosition(
  event: CalendarEventType,
  allEvents: CalendarEventType[],
  currentDate?: Date
): EventPosition {
  const dayStart = startOfDay(currentDate || new Date());
  const dayEnd = endOfDay(currentDate || new Date());

  const dayEvents = allEvents.filter(
    (e) => e.start_date <= dayEnd && e.end_date >= dayStart
  );

  const overlappingEvents = getOverlappingEvents(event, dayEvents, currentDate);
  const group = [event, ...overlappingEvents].sort((a, b) => {
    if (a.start_date.getTime() !== b.start_date.getTime()) {
      return a.start_date.getTime() - b.start_date.getTime();
    }
    return a.id.localeCompare(b.id);
  });

  const position = group.indexOf(event);
  const width = `${100 / (overlappingEvents.length + 1)}%`;
  const left = `${(position * 100) / (overlappingEvents.length + 1)}%`;

  const effectiveStartDate =
    currentDate && !isSameDay(event.start_date, currentDate)
      ? new Date(currentDate.setHours(0, 0, 0, 0))
      : event.start_date;

  const effectiveEndDate =
    currentDate && !isSameDay(event.end_date, currentDate)
      ? new Date(currentDate.setHours(23, 59, 59, 999))
      : event.end_date;

  const startHour = effectiveStartDate.getHours();
  const startMinutes = effectiveStartDate.getMinutes();

  const endHour = effectiveEndDate.getHours();
  const endMinutes = effectiveEndDate.getMinutes();

  const topPosition = startHour * 128 + (startMinutes / 60) * 128;
  const duration = endHour * 60 + endMinutes - (startHour * 60 + startMinutes);
  const height = (duration / 60) * 128;

  return {
    left,
    width,
    top: `${topPosition}px`,
    height: `${height}px`,
  };
}

export default function CalendarEvent({
  event,
  month = false,
  className,
  currentDate,
}: {
  event: CalendarEventType;
  month?: boolean;
  className?: string;
  currentDate?: Date;
}) {
  const { events, setSelectedEvent, setViewEventDialogOpen, date } =
    useCalendarContext();
  const style = month
    ? {}
    : calculateEventPosition(event, events, currentDate || date);

  const isEventInCurrentMonth = isSameMonth(event.start_date, date);
  const animationKey = `${event.id}-${
    isEventInCurrentMonth ? 'current' : 'adjacent'
  }`;

  return (
    <MotionConfig reducedMotion='user'>
      <AnimatePresence mode='wait'>
        <motion.div
          className={cn(
            `cursor-pointer truncate rounded-md px-3 py-1.5 transition-all duration-300 bg-${getColorForPriority(event.priority)}-500/10 hover:bg-${getColorForPriority(event.priority)}-500/20 border border-${getColorForPriority(event.priority)}-500`,
            !month && 'absolute',
            className
          )}
          style={style}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedEvent(event);
            setViewEventDialogOpen(true);
          }}
          initial={{
            opacity: 0,
            y: -3,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.98,
            transition: {
              duration: 0.15,
              ease: 'easeOut',
            },
          }}
          transition={{
            duration: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
            opacity: {
              duration: 0.2,
              ease: 'linear',
            },
            layout: {
              duration: 0.2,
              ease: 'easeOut',
            },
          }}
          layoutId={`event-${animationKey}-${month ? 'month' : 'day'}${currentDate ? `-${format(currentDate, 'yyyy-MM-dd')}` : ''}`}
        >
          <motion.div
            className={cn(
              `flex w-full flex-col text-${getColorForPriority(event.priority)}-500`,
              month && 'flex-row items-center justify-between'
            )}
            layout='position'
          >
            <p className={cn('truncate font-bold', month && 'text-xs')}>
              {event.title}
            </p>
            <p className={cn('text-sm', month && 'text-xs')}>
              <span>{format(event.start_date, 'h:mm a')}</span>
              <span className={cn('mx-1', month && 'hidden')}>-</span>
              <span className={cn(month && 'hidden')}>
                {format(event.end_date, 'h:mm a')}
              </span>
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
