"use client";

import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  Calendar as CalendarIcon,
  AlertCircleIcon,
  SearchIcon,
  PlusIcon,
} from "lucide-react";

type ViewMode = "month" | "week" | "day";

interface EventItem {
  id: string;
  title: string;
  time: string;
  category: "work" | "personal" | "urgent";
  hasPending: boolean;
}

export default function FullInteractiveCalendar() {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [onlyPending, setOnlyPending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<number>(15);

  const daysOfWeek = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const eventsData: Record<number, EventItem[]> = {
    5: [
      {
        id: "1",
        title: "Ajuste na API do NestJS",
        time: "09:00 - 10:30",
        category: "work",
        hasPending: true,
      },
      {
        id: "2",
        title: "Alinhamento com Design",
        time: "14:00 - 15:00",
        category: "work",
        hasPending: false,
      },
    ],
    12: [
      {
        id: "3",
        title: "Revisão de PR do Next.js",
        time: "11:00 - 12:00",
        category: "work",
        hasPending: true,
      },
    ],
    15: [
      {
        id: "4",
        title: "Reparo Térmico Mac",
        time: "10:00 - 11:30",
        category: "personal",
        hasPending: false,
      },
      {
        id: "5",
        title: "Aprovação de Fluxo ServiceNow",
        time: "15:30 - 17:00",
        category: "urgent",
        hasPending: true,
      },
    ],
    20: [
      {
        id: "6",
        title: "Refatoração de Componentes",
        time: "13:00 - 14:30",
        category: "work",
        hasPending: false,
      },
    ],
    28: [
      {
        id: "7",
        title: "Configuração do Prisma ORM",
        time: "16:00 - 18:00",
        category: "work",
        hasPending: true,
      },
    ],
  };

  const getFilteredEvents = (dayEvents: EventItem[] = []) => {
    return dayEvents.filter((evt) => {
      const matchesPending = onlyPending ? evt.hasPending : true;
      const matchesSearch = evt.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesPending && matchesSearch;
    });
  };

  const hasMatchingEvents = (day: number) => {
    const list = eventsData[day] || [];
    return getFilteredEvents(list).length > 0;
  };

  return (
    <div className="w-full max-w-7xl min-h-[52rem] rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm flex flex-col justify-between gap-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100/50">
            <CalendarIcon className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Outubro 2026</h1>
            <p className="text-sm font-medium text-slate-400">
              Gerenciamento de agenda e pendências
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar evento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <button
            onClick={() => setOnlyPending(!onlyPending)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium border transition-all ${
              onlyPending
                ? "bg-amber-50 border-amber-200 text-amber-700 shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <AlertCircleIcon
              className={`w-4 h-4 ${onlyPending ? "text-amber-600" : "text-slate-400"}`}
            />
            Apenas pendências
          </button>

          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
            {(["month", "week", "day"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  viewMode === mode
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {mode === "month" ? "Mês" : mode === "week" ? "Semana" : "Dia"}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-medium transition-all shadow-sm">
            <PlusIcon className="w-4 h-4" />
            Novo
          </button>
        </div>
      </div>

      {viewMode === "month" && (
        <div className="flex-1 flex flex-col">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3 flex-1 auto-rows-fr">
            {daysInMonth.map((day) => {
              const dayEvents = getFilteredEvents(eventsData[day]);
              const isSelected = selectedDate === day;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[6.5rem] p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500/10"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-xl ${
                        isSelected
                          ? "bg-emerald-600 text-white"
                          : "text-slate-700 group-hover:bg-slate-100"
                      }`}
                    >
                      {day}
                    </span>
                    {eventsData[day]?.some((e) => e.hasPending) && (
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </div>

                  <div className="flex flex-col gap-1 mt-2">
                    {dayEvents.slice(0, 2).map((evt) => (
                      <div
                        key={evt.id}
                        className={`px-2 py-1 rounded-lg text-[11px] font-medium truncate flex items-center gap-1.5 ${
                          evt.hasPending
                            ? "bg-amber-50 text-amber-800 border border-amber-200/50"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {evt.hasPending && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        )}
                        <span className="truncate">{evt.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[10px] font-semibold text-slate-400 px-1">
                        +{dayEvents.length - 2} mais
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === "week" && (
        <div className="flex-1 grid grid-cols-7 gap-4">
          {[12, 13, 14, 15, 16, 17, 18].map((day, idx) => {
            const dayEvents = getFilteredEvents(eventsData[day]);
            return (
              <div
                key={day}
                className="flex flex-col border border-slate-100 bg-slate-50/50 rounded-2xl p-4"
              >
                <div className="border-b border-slate-200/60 pb-3 mb-3 text-center">
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    {daysOfWeek[idx]}
                  </p>
                  <p className="text-lg font-bold text-slate-800">{day}</p>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  {dayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-400">
                          {evt.time}
                        </span>
                        {evt.hasPending && (
                          <AlertCircleIcon className="w-3.5 h-3.5 text-amber-500" />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-800">
                        {evt.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === "day" && (
        <div className="flex-1 flex flex-col gap-4 max-w-2xl mx-auto w-full">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">
                Dia Selecionado
              </p>
              <h2 className="text-xl font-bold text-slate-800">
                {selectedDate} de Outubro, 2026
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDate((prev) => Math.max(1, prev - 1))}
                className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50"
              >
                <ChevronLeftIcon className="w-4 h-4 text-slate-600" />
              </button>
              <button
                onClick={() =>
                  setSelectedDate((prev) => Math.min(31, prev + 1))
                }
                className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50"
              >
                <ChevronRightIcon className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {getFilteredEvents(eventsData[selectedDate]).length > 0 ? (
              getFilteredEvents(eventsData[selectedDate]).map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${
                        evt.hasPending
                          ? "bg-amber-50 text-amber-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        {evt.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-400">
                        {evt.time}
                      </p>
                    </div>
                  </div>
                  {evt.hasPending && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                      Pendente
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm font-medium">
                Nenhum compromisso encontrado para este dia.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-medium text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />{" "}
            Concluído
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pendência
          </span>
        </div>
        <span>
          {getFilteredEvents(Object.values(eventsData).flat()).length} eventos
          filtrados
        </span>
      </div>
    </div>
  );
}
