import { User } from "@supabase/supabase-js";

interface UserWithRole extends User {
    role: number
    name: string
}

interface EventForm {
  id: string
  createdBy: { id: string, email: string, name: string, role: number }
  title: string
  description: string
  priority: string
  target: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
}