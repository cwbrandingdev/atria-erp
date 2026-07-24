"use client";

import { useState } from "react";
import { ExternalLink, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventFormDialog } from "@/components/calendar/event-form-dialog";
import {
  CATEGORY_LABELS,
  formatEventDate,
  formatEventTimeRange,
  getEventDisplayColor,
} from "@/lib/calendar-utils";
import { toast } from "@/lib/toast";
import { calendarService } from "@/services";
import type { CalendarEvent } from "@/services/types";

interface EventDetailDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
  onUpdated: () => void;
}

export function EventDetailDialog({
  event,
  open,
  onOpenChange,
  onDeleted,
  onUpdated,
}: EventDetailDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  async function handleDelete() {
    if (!event) return;
    setDeleting(true);
    try {
      await calendarService.deleteEvent(event.id);
      toast.success("Evento excluído.");
      onOpenChange(false);
      onDeleted();
    } catch {
      toast.error("Não foi possível excluir o evento.");
    } finally {
      setDeleting(false);
    }
  }

  if (!event) return null;

  const displayColor = getEventDisplayColor(event);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <span
                className="mt-1 h-3 w-3 shrink-0 rounded-full shadow-[0_0_10px_currentColor]"
                style={{ backgroundColor: displayColor, color: displayColor }}
              />
              <div className="flex-1">
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
            {event.client && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Cliente
                </p>
                <Badge
                  className="mt-1 border-0 font-semibold shadow-sm"
                  style={{
                    backgroundColor: `${event.client.color}22`,
                    color: event.client.color,
                  }}
                >
                  {event.client.companyName}
                </Badge>
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-muted-foreground">Data</p>
              <p className="text-[var(--atria-primary)]">
                {formatEventDate(event.startAt)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Horário
              </p>
              <p className="text-[var(--atria-primary)]">
                {formatEventTimeRange(event.startAt, event.endAt)}
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

            {event.referenceUrl && (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Referência
                </p>
                <a
                  href={event.referenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-sm font-medium text-cyan-700 transition-colors hover:bg-cyan-100"
                >
                  <ExternalLink className="size-4" />
                  Abrir Link de Referência
                </a>
              </div>
            )}

            {event.isPending && (
              <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                Pendente
              </span>
            )}
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="size-4" />
              Editar
            </Button>

            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => void handleDelete()}
                disabled={deleting}
              >
                {deleting ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EventFormDialog
        event={event}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={() => {
          setEditOpen(false);
          onOpenChange(false);
          onUpdated();
        }}
      />
    </>
  );
}
