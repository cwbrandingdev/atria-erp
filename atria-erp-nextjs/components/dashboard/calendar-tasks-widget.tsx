import Link from "next/link";
import { ArrowRight, Calendar, Kanban } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { DashboardOverview } from "@/services/types";

const PRIORITY_STYLES: Record<string, string> = {
  critical: "bg-red-200/80 text-red-900",
  high: "bg-orange-200/80 text-orange-900",
  medium: "bg-amber-200/80 text-amber-900",
  low: "bg-teal-200/80 text-teal-900",
  planned: "bg-violet-100/80 text-violet-900",
};

const PRIORITY_LABELS: Record<string, string> = {
  critical: "Crítica",
  high: "Alta",
  medium: "Média",
  low: "Baixa",
  planned: "Planejado",
};

interface CalendarTasksWidgetProps {
  calendar: DashboardOverview["calendar"];
  kanban: DashboardOverview["kanban"];
}

function formatTimeRange(startAt: string, endAt: string) {
  const fmt = (d: string) =>
    new Date(d).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  return `${fmt(startAt)} – ${fmt(endAt)}`;
}

export function CalendarTasksWidget({
  calendar,
  kanban,
}: CalendarTasksWidgetProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[var(--atria-accent)]/30 p-2 text-[var(--atria-primary)]">
              <Calendar className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold text-[var(--atria-primary)]">
                Agenda de Hoje
              </h2>
              <p className="text-xs text-[var(--atria-primary)]/50">
                Reuniões e compromissos da equipe
              </p>
            </div>
          </div>
          <Link
            href="/calendar"
            className="flex items-center gap-1 text-xs font-medium text-[var(--atria-primary)] hover:underline"
          >
            Ver mais <ArrowRight className="size-3" />
          </Link>
        </div>

        {calendar.todayMeetings.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--atria-primary)]/40">
            Nenhum compromisso para hoje.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {calendar.todayMeetings.map((event) => (
              <li
                key={event.id}
                className="flex items-start gap-3 rounded-xl border border-[var(--atria-primary)]/10 p-3"
              >
                <span
                  className="mt-1 h-8 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[var(--atria-primary)]">
                    {event.title}
                  </p>
                  <p className="text-xs text-[var(--atria-primary)]/50">
                    {formatTimeRange(event.startAt, event.endAt)}
                  </p>
                </div>
                {event.isPending && (
                  <span className="shrink-0 rounded-full bg-[var(--atria-accent)]/30 px-2 py-0.5 text-[10px] font-medium text-[var(--atria-primary)]">
                    Pendente
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[var(--atria-primary)] p-2 text-white">
              <Kanban className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold text-[var(--atria-primary)]">
                Minhas Tarefas
              </h2>
              <p className="text-xs text-[var(--atria-primary)]/50">
                Kanban ativo
              </p>
            </div>
          </div>
          <Link
            href="/kanban"
            className="flex items-center gap-1 text-xs font-medium text-[var(--atria-primary)] hover:underline"
          >
            Ver mais <ArrowRight className="size-3" />
          </Link>
        </div>

        {kanban.myTasks.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--atria-primary)]/40">
            Nenhuma tarefa atribuída a você.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {kanban.myTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between rounded-xl border border-[var(--atria-primary)]/10 px-3 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--atria-primary)]">
                    {task.title}
                  </p>
                  <p className="text-[10px] text-[var(--atria-primary)]/50">
                    {task.column}
                  </p>
                </div>
                <span
                  className={`ml-2 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${PRIORITY_STYLES[task.priority] ?? ""}`}
                >
                  {PRIORITY_LABELS[task.priority] ?? task.priority}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
