// src/components/CalendarViewEventDialog.jsx
import React from 'react'
import { useCalendarContext } from '../../../context/calendar-context'
import { format } from 'date-fns'
import { getColorForPriority } from '@/lib/utils'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar, Clock, Tag, User } from 'lucide-react' // Import the User icon
import { Badge } from '@/components/ui/badge'

function CalendarViewEventDialog() {
  const { viewEventDialogOpen, setViewEventDialogOpen, selectedEvent, setSelectedEvent } = useCalendarContext()

  function handleClose() {
    setViewEventDialogOpen(false)
    setSelectedEvent(null)
  }

  if (!selectedEvent) {
    return null
  }

  const startDate = format(selectedEvent.start_date, 'PPPP')
  const startTime = format(selectedEvent.start_date, 'h:mm a')
  const endDate = format(selectedEvent.end_date, 'PPPP')
  const endTime = format(selectedEvent.end_date, 'h:mm a')
  const colorClass = `bg-${getColorForPriority(selectedEvent.priority)}-500 text-${getColorForPriority(selectedEvent.priority)}-50-foreground`

  return (
    <Dialog open={viewEventDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{selectedEvent.title}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {selectedEvent.description || 'No hay descripción para este evento.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">
              {startDate}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">
              {startTime} - {endTime}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <Badge className={colorClass}>
              {selectedEvent.priority || 'Normal'}
            </Badge>
          </div>
          
          {selectedEvent.author?.name && (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">
                Creado por: {selectedEvent.author.name}
              </span>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CalendarViewEventDialog