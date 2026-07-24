export const CLIENT_CALENDAR_COLORS = [
  "#8B5CF6",
  "#06B6D4",
  "#3B82F6",
  "#F97316",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#6366F1",
  "#14B8A6",
  "#EF4444",
] as const;

export function getClientCalendarColor(clientId: string) {
  let hash = 0;
  for (let i = 0; i < clientId.length; i++) {
    hash = clientId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CLIENT_CALENDAR_COLORS[Math.abs(hash) % CLIENT_CALENDAR_COLORS.length];
}

export function getEventDisplayColor(event: {
  color: string;
  client?: { color?: string } | null;
  assignee?: { color?: string } | null;
}) {
  return event.client?.color ?? event.assignee?.color ?? event.color;
}

export const CATEGORY_LABELS = {
  meeting: "Reunião",
  deadline: "Prazo",
  publish: "Publicação",
  other: "Outro",
} as const;

export function formatEventDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatEventTimeRange(startAt: string, endAt: string) {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const fmt = (d: Date) =>
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function isValidReferenceUrl(value: string) {
  if (!value.trim()) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
