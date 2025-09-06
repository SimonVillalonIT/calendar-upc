import { User } from "@supabase/supabase-js";

type Role = "admin" | "teacher"

interface UserWithRole extends User {
    role: Role
    name: string
}

interface EventForm {
  id: string
  createdBy: { id: string, email: string, name: string, role: Role }
  title: string
  description: string
  priority: string
  target: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
}