import React from 'react';
import { useCalendarContext } from '../../../context/calendar-context';
import { format } from 'date-fns';
import { getColorForPriority } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Calendar, Tag, User, Pencil, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/user-context';
import { deleteEvent } from '@/lib/events';
import { PRIORITIES } from '@/lib/constants';

function CalendarViewEventDialog() {
  const {
    viewEventDialogOpen,
    setViewEventDialogOpen,
    setManageEventDialogOpen,
    selectedEvent,
    setSelectedEvent,
    events,
    setEvents,
  } = useCalendarContext();
  const { user } = useUser();

  if (!selectedEvent) {
    return null;
  }
  function handleClose() {
    setViewEventDialogOpen(false);
    setSelectedEvent(null);
  }

  async function handleDelete() {
    if (!selectedEvent) return;

    try {
      const error = await deleteEvent(selectedEvent.id);

      if (error) {
        throw new Error(error.message);
      }

      setEvents(events.filter((event) => event.id !== selectedEvent.id));
      handleClose();
    } catch (error) {
      console.log('Error deleting event:', error);
    }
  }

  const startDate = format(selectedEvent.start_date, 'PPPP', { locale: es });
  const startTime = format(selectedEvent.start_date, 'h:mm a');
  const endDate = format(selectedEvent.end_date, 'PPPP', { locale: es });
  const endTime = format(selectedEvent.end_date, 'h:mm a');
  const colorClass = `bg-${getColorForPriority(selectedEvent.priority)}-500 text-${getColorForPriority(selectedEvent.priority)}-50-foreground`;

  return (
    <Dialog open={viewEventDialogOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            {selectedEvent.title}
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-500'>
            {selectedEvent.description ||
              'No hay descripción para este evento.'}
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='space-y-4'>
            <div>
              <div className='mb-1 flex items-center space-x-2'>
                <Calendar className='h-5 w-5 text-gray-600 dark:text-gray-400' />
                <span className='text-base font-semibold text-gray-800 dark:text-gray-200'>
                  Fecha de Inicio
                </span>
              </div>
              <div className='flex items-center space-x-2 pl-7'>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {startDate} - {startTime}
                </span>
              </div>
            </div>
            <div>
              <div className='mb-1 flex items-center space-x-2'>
                <Calendar className='h-5 w-5 text-gray-600 dark:text-gray-400' />
                <span className='text-base font-semibold text-gray-800 dark:text-gray-200'>
                  Fecha de Finalización
                </span>
              </div>
              <div className='flex items-center space-x-2 pl-7'>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {endDate} - {endTime}
                </span>
              </div>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <Tag className='h-4 w-4 text-gray-500' />
            <Badge className={colorClass}>
              {PRIORITIES[
                selectedEvent.priority as unknown as keyof typeof PRIORITIES
              ] || 'Normal'}
            </Badge>
          </div>

          {selectedEvent.author?.name && (
            <div className='flex items-center space-x-2'>
              <User className='h-4 w-4 text-gray-500' />
              <span className='text-sm font-medium'>
                Creado por: {selectedEvent.author.name}
              </span>
            </div>
          )}
        </div>
        {user?.role === 1 || user?.id === selectedEvent.author.id ? (
          <DialogFooter className='flex items-center justify-between'>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='destructive'
                  className='flex items-center gap-2'
                >
                  <Trash className='h-4 w-4' />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className='z-50'>
                <AlertDialogHeader>
                  <AlertDialogTitle>Borrar evento</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Seguro que quieres borrar este evento? Esta acción no puede
                    deshacerse.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Borrar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              onClick={() => {
                setManageEventDialogOpen(true);
              }}
              variant='outline'
              className='flex items-center gap-2'
            >
              <Pencil className='h-4 w-4' />
              Editar
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default CalendarViewEventDialog;
