"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { KanbanCard, KanbanColumn } from "@/services/types";

const columns: KanbanColumn[] = [
  { id: "todo", title: "A fazer", order: 0 },
  { id: "progress", title: "Em progresso", order: 1 },
  { id: "review", title: "Revisão", order: 2 },
  { id: "done", title: "Concluído", order: 3 },
];

const initialCards: KanbanCard[] = [
  {
    id: "1",
    columnId: "todo",
    title: "Briefing Cliente X",
    description: "Revisar documento de briefing",
    priority: "high",
    order: 0,
  },
  {
    id: "2",
    columnId: "todo",
    title: "Roteiro Reels",
    description: "Criar roteiro para campanha de verão",
    priority: "medium",
    order: 1,
  },
  {
    id: "3",
    columnId: "progress",
    title: "Design Post Instagram",
    assignee: "Ana",
    priority: "medium",
    order: 0,
  },
  {
    id: "4",
    columnId: "review",
    title: "Vídeo TikTok",
    description: "Aguardando aprovação do cliente",
    priority: "high",
    order: 0,
  },
  {
    id: "5",
    columnId: "done",
    title: "Calendário Editorial",
    assignee: "Carlos",
    order: 0,
  },
];

const priorityColors = {
  low: "bg-[#013C3C]/10 text-[#013C3C]/60",
  medium: "bg-[#E8C39E]/40 text-[#013C3C]",
  high: "bg-[#013C3C] text-white",
};

export default function KanbanPage() {
  const [cards] = useState(initialCards);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#013C3C]">Kanban</h1>
          <p className="text-sm text-[#013C3C]/50">
            Gerencie tarefas e fluxo de produção
          </p>
        </div>
        <Button className="bg-[#013C3C] text-white hover:bg-[#013C3C]/90">
          <Plus className="mr-2 h-4 w-4" />
          Nova tarefa
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => {
          const columnCards = cards.filter((c) => c.columnId === column.id);

          return (
            <div key={column.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold text-[#013C3C]">
                  {column.title}
                </h2>
                <span className="rounded-full bg-[#E8C39E]/30 px-2 py-0.5 text-xs font-medium text-[#013C3C]">
                  {columnCards.length}
                </span>
              </div>

              <div className="flex min-h-[400px] flex-col gap-3 rounded-2xl border border-[#013C3C]/10 bg-[#013C3C]/[0.02] p-3">
                {columnCards.map((card) => (
                  <Card
                    key={card.id}
                    className="cursor-pointer rounded-xl border border-[#013C3C]/10 bg-white p-4 transition-shadow hover:shadow-sm"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="text-sm font-medium text-[#013C3C]">
                        {card.title}
                      </h3>
                      {card.priority && (
                        <span
                          className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${priorityColors[card.priority]}`}
                        >
                          {card.priority}
                        </span>
                      )}
                    </div>
                    {card.description && (
                      <p className="mb-2 text-xs text-[#013C3C]/50">
                        {card.description}
                      </p>
                    )}
                    {card.assignee && (
                      <span className="inline-block rounded-full bg-[#E8C39E]/30 px-2 py-0.5 text-[10px] font-medium text-[#013C3C]">
                        {card.assignee}
                      </span>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
