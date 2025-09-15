import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useCalendarContext } from '../../../../context/calendar-context'
import { useUser } from '@/context/user-context'

export default function CalendarHeaderActionsAdd() {
  const {user} = useUser()
  const { setNewEventDialogOpen } = useCalendarContext()

  if (!user) return null
  return (
    <Button
      className="flex items-center gap-1 bg-primary text-background"
      onClick={() => setNewEventDialogOpen(true)}
    >
      <Plus />
      Agregar Evento
    </Button>
  )
}
