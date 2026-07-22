import type { KanbanPriority } from "@/services/types";

export const PRIORITY_LABELS: Record<KanbanPriority, string> = {
  critical: "Crítica",
  high: "Alta",
  medium: "Média",
  low: "Baixa",
  planned: "Planejado",
};

export const PRIORITY_BADGE_STYLES: Record<KanbanPriority, string> = {
  critical: "bg-red-200/80 text-red-900",
  high: "bg-orange-200/80 text-orange-900",
  medium: "bg-amber-200/80 text-amber-900",
  low: "bg-teal-200/80 text-teal-900",
  planned: "bg-violet-100/80 text-violet-900",
};

export const PRIORITY_CARD_STYLES: Record<KanbanPriority, string> = {
  critical: "bg-red-50 border-red-200/60",
  high: "bg-orange-50 border-orange-200/60",
  medium: "bg-amber-50 border-amber-200/60",
  low: "bg-teal-50 border-teal-200/60",
  planned: "bg-slate-50 border-slate-200/60",
};

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
