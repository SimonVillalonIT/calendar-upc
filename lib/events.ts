import { CalendarEvent } from "@/types/calendar-types";
import { createClient } from "./supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import { Database } from "@/database.types";
import { UserWithRole } from "@/types/globals";

const supabase = createClient()

export async function getEvents(user: UserWithRole | null): Promise<{ data: CalendarEvent[] | null, error: PostgrestError | null }> {

    if (user && user.role === 'teacher') {
        // @ts-expect-error: RPC function type not in generated types
        const { data, error } = await supabase.rpc("get_events_for_teacher_and_students", {_teacher_id: user.id}) as Database["public"]["Functions"]["get_events_with_author"]
        return { data: data as CalendarEvent[], error }
    }
     if (user && user.role === 'admin') {
        // @ts-expect-error: RPC function type not in generated types
        const { data, error } = await supabase.rpc("get_events_with_author") as Database["public"]["Functions"]["get_events_with_author"]
        return { data: data as CalendarEvent[], error }
    }
        // @ts-expect-error: RPC function type not in generated types
        const { data, error } = await supabase.rpc("get_events_for_students") as Database["public"]["Functions"]["get_events_with_author"]
        return { data: data as CalendarEvent[], error }
}

export async function addEvent(values: {
    end_date: string;
    start_date: string;
    title: string;
    description?: string | undefined;
    priority?: string | undefined;
    target?: string | undefined;
}) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        console.error("Usuario no autenticado.")
        throw new Error("Usuario no autenticado.")
    }

    const newEvent = {
        title: values.title,
        description: values.description,
        start_date: values.start_date,
        end_date: values.end_date,
        priority: values.priority,
        target: values.target,
        created_by: user.id,
    }
    const { error } = await supabase.from("events").insert([newEvent])

    return error
}

export async function editEvent(id: string, values: {
    end_date: string;
    start_date: string;
    title: string;
    description?: string | undefined;
    priority?: string | undefined;
    target?: string | undefined;
}) {

    const { error } = await supabase.from("events").update(values).eq("id", id)

    return error
}

export async function deleteEvent(id: string) {
    const { error } = await supabase.from("events").delete().eq("id", id)

    return error
}