"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { calendarService } from "@/services";
import type { CalendarEvent } from "@/services/types";

function formatTimeRange(startAt: string, endAt: string) {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const fmt = (d: Date) =>
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${fmt(start)} – ${fmt(end)}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const CATEGORY_LABELS = {
  meeting: "Reunião",
  deadline: "Prazo",
  publish: "Publicação",
  other: "Outro",
};

interface EventDetailDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export function EventDetailDialog({
  event,
  open,
  onOpenChange,
  onDeleted,
}: EventDetailDialogProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!event) return;
    setDeleting(true);
    try {
      await calendarService.deleteEvent(event.id);
      onOpenChange(false);
      onDeleted();
    } finally {
      setDeleting(false);
    }
  }

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <span
              className="mt-1 h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: event.color }}
            />
            <div>
              <DialogTitle className="text-[var(--atria-primary)]">
                {event.title}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                {CATEGORY_LABELS[event.category]}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Data</p>
            <p className="text-[var(--atria-primary)]">
              {formatDate(event.startAt)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Horário</p>
            <p className="text-[var(--atria-primary)]">
              {formatTimeRange(event.startAt, event.endAt)}
            </p>
          </div>
          {event.description && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Descrição
              </p>
              <p className="text-[var(--atria-primary)]/80">
                {event.description}
              </p>
            </div>
          )}
          {event.assignee && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Responsável
              </p>
              <p className="text-[var(--atria-primary)]">
                {event.assignee.name}
              </p>
            </div>
          )}
          {event.isPending && (
            <span className="inline-flex rounded-full bg-[var(--atria-accent)]/30 px-2.5 py-0.5 text-xs font-medium text-[var(--atria-primary)]">
              Pendente
            </span>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={deleting}
          >
            {deleting ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
