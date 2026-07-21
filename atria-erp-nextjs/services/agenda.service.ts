import { apiRequest } from "./api";
import type { AgendaEvent } from "./types";

export async function getEvents(params?: {
  from?: string;
  to?: string;
}): Promise<AgendaEvent[]> {
  const query = new URLSearchParams(
    Object.entries(params ?? {})
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)]),
  ).toString();

  return apiRequest<AgendaEvent[]>(`/agenda/events${query ? `?${query}` : ""}`);
}

export async function createEvent(
  data: Omit<AgendaEvent, "id">,
): Promise<AgendaEvent> {
  return apiRequest<AgendaEvent>("/agenda/events", {
    method: "POST",
    body: data,
  });
}

export async function updateEvent(
  id: string,
  data: Partial<AgendaEvent>,
): Promise<AgendaEvent> {
  return apiRequest<AgendaEvent>(`/agenda/events/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteEvent(id: string): Promise<void> {
  return apiRequest<void>(`/agenda/events/${id}`, { method: "DELETE" });
}
