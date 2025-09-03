import { CalendarEvent, Profile } from '@/components/calendar/calendar-types'
import { addDays, startOfMonth, endOfMonth } from 'date-fns' // Importamos endOfMonth
import { colorOptions } from '@/components/calendar/calendar-tailwind-classes'

const EVENT_TITLES = [
  'Team Standup',
  'Project Review',
  'Client Meeting',
  'Design Workshop',
  'Code Review',
  'Sprint Planning',
  'Product Demo',
  'Architecture Discussion',
  'User Testing',
  'Stakeholder Update',
  'Tech Talk',
  'Deployment Planning',
  'Bug Triage',
  'Feature Planning',
  'Team Training',
]

// Opciones para la prioridad y el target
const PRIORITIES = ['Low', 'Medium', 'High']
const TARGETS = ['Team A', 'Project X', 'Marketing']

function getRandomTime(date: Date): Date {
  const hours = Math.floor(Math.random() * 14) + 8 // 8 AM to 10 PM
  const minutes = Math.floor(Math.random() * 4) * 15 // 0, 15, 30, 45
  return new Date(date.setHours(hours, minutes, 0, 0))
}

function generateEventDuration(): number {
  const durations = [30, 60, 90, 120] // in minutes
  return durations[Math.floor(Math.random() * durations.length)]
}

export function generateMockEvents(): CalendarEvent[] {
  const events: CalendarEvent[] = []
  const startDate = startOfMonth(new Date())
  const endDate = endOfMonth(new Date()) // Obtenemos el final del mes

  const daysInMonth = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)

  // Generamos una cantidad razonable de eventos para el mes
  const numberOfEvents = 50 

  for (let i = 0; i < numberOfEvents; i++) {
    // Generar días aleatorios solo dentro del mes actual
    const daysToAdd = Math.floor(Math.random() * daysInMonth)
    const eventDate = addDays(startDate, daysToAdd)

    const startTime = getRandomTime(eventDate)
    const durationMinutes = generateEventDuration()
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000)

    // Datos de ejemplo para el autor
    const author: Profile = {
        id: `user-${i + 1}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: 'admin'
    }

    // Seleccionamos un valor aleatorio de las prioridades y targets
    const randomPriority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)]
    const randomTarget = TARGETS[Math.floor(Math.random() * TARGETS.length)]

    // Función para asignar el color (la misma lógica que definimos antes)
    function getColorForPriority(priority: string) {
      switch (priority) {
        case 'High':
          return 'red'
        case 'Medium':
          return 'orange'
        case 'Low':
          return 'green'
        default:
          return 'blue'
      }
    }
    
    events.push({
      id: `event-${i + 1}`,
      title: EVENT_TITLES[Math.floor(Math.random() * EVENT_TITLES.length)],
      priority: randomPriority,
      start_date: startTime,
      end_date: endTime,
      target: randomTarget,
      author: author,
    })
  }

  // Ordenar eventos por fecha de inicio
  return events.sort((a, b) => a.start_date.getTime() - b.start_date.getTime())
}