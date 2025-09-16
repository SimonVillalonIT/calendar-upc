'use client'

import { useEffect, useState } from 'react'
import Calendar from './calendar/calendar'
import { CalendarEvent, Mode } from '../types/calendar-types'
import { generateMockEvents } from '@/lib/mock-calendar-events'
import { createClient } from '@/lib/supabase/client'

export default function CalendarDemo() {
  const [events, setEvents] = useState<CalendarEvent[]>(generateMockEvents())
  const [mode, setMode] = useState<Mode>('month')
  const [date, setDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      try {
        const { data, error } = await supabase.rpc("get_events_with_author")
        if (data) {
          setEvents(data)
          console.log(data)
        } else {
          console.log(error)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return loading ? "Loading ..." : (
    <Calendar
      events={events}
      setEvents={setEvents}
      mode={mode}
      setMode={setMode}
      date={date}
      setDate={setDate}
    />
  )
}
