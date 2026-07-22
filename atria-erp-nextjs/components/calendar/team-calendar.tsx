"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { calendarService } from "@/services";
import type { CalendarEvent } from "@/services/types";
import { CreateEventDialog } from "./create-event-dialog";
import { EventDetailDialog } from "./event-detail-dialog";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function TeamCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [onlyPending, setOnlyPending] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const from = new Date(year, month, 1).toISOString();
      const to = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
      const data = await calendarService.getEvents({ from, to });
      setEvents(data);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch = evt.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesPending = onlyPending ? evt.isPending : true;
      return matchesSearch && matchesPending;
    });
  }, [events, search, onlyPending]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const evt of filteredEvents) {
      const key = new Date(evt.startAt).toDateString();
      const list = map.get(key) ?? [];
      list.push(evt);
      map.set(key, list);
    }
    return map;
  }, [filteredEvents]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay();
    const days: (Date | null)[] = [];

    for (let i = 0; i < startPad; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  }, [currentDate]);

  function prevMonth() {
    setCurrentDate(
      (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1),
    );
  }

  function nextMonth() {
    setCurrentDate(
      (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1),
    );
  }

  function openEvent(evt: CalendarEvent) {
    setSelectedEvent(evt);
    setDetailOpen(true);
  }

  const selectedDayEvents =
    eventsByDay.get(selectedDate.toDateString()) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-[var(--atria-primary)]/10 bg-[var(--atria-accent)]/20 p-3 text-[var(--atria-primary)]">
            <CalendarIcon className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--atria-primary)]">
              Calendário da Equipe
            </h1>
            <p className="text-sm text-[var(--atria-primary)]/50">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-48 rounded-lg border border-[var(--atria-primary)]/20 bg-white pr-3 pl-9 text-sm"
            />
          </div>

          <button
            type="button"
            onClick={() => setOnlyPending(!onlyPending)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              onlyPending
                ? "border-[var(--atria-accent)] bg-[var(--atria-accent)]/20 text-[var(--atria-primary)]"
                : "border-[var(--atria-primary)]/20 text-[var(--atria-primary)]/70"
            }`}
          >
            <AlertCircle className="size-4" />
            Pendências
          </button>

          <CreateEventDialog
            defaultDate={selectedDate}
            onSuccess={() => void loadEvents()}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-lg p-2 hover:bg-muted"
          >
            <ChevronLeft className="size-5 text-[var(--atria-primary)]" />
          </button>
          <h2 className="font-semibold text-[var(--atria-primary)]">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-lg p-2 hover:bg-muted"
          >
            <ChevronRight className="size-5 text-[var(--atria-primary)]" />
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1">
          {DAYS.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-semibold text-[var(--atria-primary)]/50 uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--atria-primary)] border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              if (!day) {
                return <div key={`empty-${idx}`} className="min-h-24" />;
              }

              const dayEvents = eventsByDay.get(day.toDateString()) ?? [];
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-24 rounded-xl border p-2 text-left transition-colors ${
                    isSelected
                      ? "border-[var(--atria-primary)] bg-[var(--atria-primary)]/5 ring-2 ring-[var(--atria-primary)]/10"
                      : "border-[var(--atria-primary)]/10 hover:border-[var(--atria-primary)]/30"
                  }`}
                >
                  <span
                    className={`inline-flex size-7 items-center justify-center rounded-lg text-sm font-bold ${
                      isToday
                        ? "bg-[var(--atria-primary)] text-white"
                        : "text-[var(--atria-primary)]"
                    }`}
                  >
                    {day.getDate()}
                  </span>

                  <div className="mt-1 flex flex-col gap-0.5">
                    {dayEvents.slice(0, 2).map((evt) => (
                      <div
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEvent(evt);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") openEvent(evt);
                        }}
                        role="button"
                        tabIndex={0}
                        className="truncate rounded px-1.5 py-0.5 text-[10px] font-medium text-white"
                        style={{
                          backgroundColor: evt.assignee?.color ?? evt.color,
                        }}
                      >
                        {evt.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[10px] text-[var(--atria-primary)]/50">
                        +{dayEvents.length - 2} mais
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6">
        <h3 className="mb-4 font-semibold text-[var(--atria-primary)]">
          {selectedDate.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </h3>

        {selectedDayEvents.length === 0 ? (
          <p className="text-sm text-[var(--atria-primary)]/40">
            Nenhum evento neste dia.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {selectedDayEvents.map((evt) => (
              <button
                key={evt.id}
                type="button"
                onClick={() => openEvent(evt)}
                className="flex items-center gap-3 rounded-xl border border-[var(--atria-primary)]/10 p-3 text-left transition-colors hover:bg-muted/50"
              >
                <span
                  className="h-10 w-1 shrink-0 rounded-full"
                  style={{
                    backgroundColor: evt.assignee?.color ?? evt.color,
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--atria-primary)]">
                    {evt.title}
                  </p>
                  <p className="text-xs text-[var(--atria-primary)]/50">
                    {new Date(evt.startAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" – "}
                    {new Date(evt.endAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {evt.isPending && (
                  <span className="rounded-full bg-[var(--atria-accent)]/30 px-2 py-0.5 text-[10px] font-medium text-[var(--atria-primary)]">
                    Pendente
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <EventDetailDialog
        event={selectedEvent}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onDeleted={() => void loadEvents()}
      />
    </div>
  );
}
