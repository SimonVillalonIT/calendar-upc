import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { format } from 'date-fns'
import { DateTimePicker } from '@/components/form/date-time-picker'
import { Textarea } from '@/components/ui/textarea'
import { Profile } from '../../../types/calendar-types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getColorForPriority } from '@/lib/utils'

const formSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    start_date: z.string().datetime(),
    end_date: z.string().datetime(),
    priority: z.string().optional(),
    target: z.string().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_date)
      const end = new Date(data.end_date)
      return end >= start
    },
    {
      message: 'End time must be after start time',
      path: ['end_date'],
    }
  )

export default function CalendarNewEventDialog() {
  const { newEventDialogOpen, setNewEventDialogOpen, date, events, setEvents } =
    useCalendarContext()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      start_date: format(date, "yyyy-MM-dd'T'HH:mm"),
      end_date: format(date, "yyyy-MM-dd'T'HH:mm"),
      priority: '',
      target: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newEvent = {
      id: crypto.randomUUID(),
      title: values.title,
      description: values.description,
      start_date: new Date(values.start_date),
      end_date: new Date(values.end_date),
      priority: values.priority,
      target: values.target,
      author: { id: '1', email: 'test@test.com', name: 'Test User', role: 'teacher' as Profile['role'] },
    }

    setEvents([...events, newEvent])
    setNewEventDialogOpen(false)
    form.reset()
  }

  return (
    <Dialog open={newEventDialogOpen} onOpenChange={setNewEventDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear un evento</DialogTitle>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <div className="flex justify-end">
              <Button type="submit">Crear evento</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}