export type Profile = {
  id: string
  email: string | null
  name: string | null
  role: "admin" | "teacher"  
}

export type CalendarProps = {
  events: CalendarEvent[]
  setEvents: (events: CalendarEvent[]) => void
  mode: Mode
  setMode: (mode: Mode) => void
  date: Date
  setDate: (date: Date) => void
  calendarIconIsToday?: boolean
}

export type CalendarContextType = CalendarProps & {
  newEventDialogOpen: boolean
  setNewEventDialogOpen: (open: boolean) => void
  viewEventDialogOpen: boolean
  setViewEventDialogOpen: (open: boolean) => void
  manageEventDialogOpen: boolean
  setManageEventDialogOpen: (open: boolean) => void
  selectedEvent: CalendarEvent | null
  setSelectedEvent: (event: CalendarEvent | null) => void
}

export type CalendarEvent = {
  id: string
  title: string
  description?: string
  priority?: string
  target?: string
  start_date: Date
  end_date: Date
  author: Profile 
}

export const calendarModes = ['day', 'week', 'month'] as const
export type Mode = (typeof calendarModes)[number]
