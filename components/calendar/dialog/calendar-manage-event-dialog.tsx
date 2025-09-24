import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCalendarContext } from '../../../context/calendar-context'
import { DateTimePicker } from '@/components/form/date-time-picker'
import { getColorForPriority } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { editEvent } from '@/lib/events'

const formSchema = z
  .object({
    title: z.string().min(1, 'El titulo es obligatorio'),
    description: z.string().optional(),
    start_date: z.string().datetime(),
    end_date: z.string().datetime(),
    priority: z.string(),
    target: z.string(),
  })
  .refine(
    (data) => {
      try {
        const start = new Date(data.start_date)
        const end = new Date(data.end_date)
        return end >= start
      } catch {
        return false
      }
    },
    {
      message: 'Tiempo de finalización debe ser posterior al tiempo de inicio',
      path: ['end_date'],
    }
  )

export default function CalendarManageEventDialog() {
  const {
    manageEventDialogOpen,
    setManageEventDialogOpen,
    selectedEvent,
    setSelectedEvent,
    events,
    setEvents,
  } = useCalendarContext()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      priority: '',
      target: '',
    },
  })

  useEffect(() => {
    if (selectedEvent) {
      const startDateObject = new Date(selectedEvent.start_date);
      const endDateObject = new Date(selectedEvent.end_date);
      form.reset({
        title: selectedEvent.title,
        description: selectedEvent.description,
        start_date: startDateObject.toISOString(),
        end_date: endDateObject.toISOString(),
        priority: selectedEvent.priority,
        target: selectedEvent.target,
      })
    }
  }, [selectedEvent, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedEvent) return

    const updatedEvent = {
      ...selectedEvent,
      title: values.title,
      description: values.description,
      start_date: new Date(values.start_date),
      end_date: new Date(values.end_date),
      priority: values.priority,
      target: values.target,
    }

    try {
      const error = await editEvent(selectedEvent.id, values)

      if (error) throw new Error(error.message)

      setEvents(
        events.map((event) =>
          event.id === selectedEvent.id ? updatedEvent : event
        )
      )
      handleClose()
    } catch (e) {
      console.log(e)
      return
    }
  }

  function handleClose() {
    setManageEventDialogOpen(false)
    setSelectedEvent(null)
    form.reset()
  }

  return (
    <Dialog open={manageEventDialogOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar evento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título del evento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descripción del evento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Fecha de Inicio</FormLabel>
                  <FormControl>
                    <DateTimePicker field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Fecha de Finalización</FormLabel>
                  <FormControl>
                    <DateTimePicker field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Prioridad</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl className={`text-${getColorForPriority(field.value)}-500`}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona prioridad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem className="text-red-500 cursor-pointer focus:text-red-700" value="High">Prioritario</SelectItem>
                      <SelectItem className="text-yellow-500 cursor-pointer focus:text-yellow-700" value="Medium">Importante</SelectItem>
                      <SelectItem className="text-blue-500 cursor-pointer focus:text-blue-700" value="Low">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Visibilidad</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona quién podrá verlo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="student">Alumnos</SelectItem>
                      <SelectItem value="teacher">Profesores</SelectItem>
                      <SelectItem value="admin">Administración</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-between gap-2">
              
              <Button type="submit">Actualizar evento</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}