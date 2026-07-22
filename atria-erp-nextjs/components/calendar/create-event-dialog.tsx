"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { calendarService, ApiError } from "@/services";
import type { TeamMember } from "@/services/types";

interface CreateEventDialogProps {
  defaultDate?: Date;
  onSuccess: () => void;
}

export function CreateEventDialog({
  defaultDate,
  onSuccess,
}: CreateEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);

  const dateStr = (defaultDate ?? new Date()).toISOString().split("T")[0];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(dateStr);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [category, setCategory] = useState<
    "meeting" | "deadline" | "publish" | "other"
  >("meeting");
  const [assigneeId, setAssigneeId] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (open) {
      calendarService.getTeamMembers().then(setMembers).catch(() => setMembers([]));
    }
  }, [open]);

  useEffect(() => {
    if (defaultDate) {
      setDate(defaultDate.toISOString().split("T")[0]);
    }
  }, [defaultDate]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setDate(dateStr);
    setStartTime("09:00");
    setEndTime("10:00");
    setCategory("meeting");
    setAssigneeId("");
    setIsPending(false);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const startAt = new Date(`${date}T${startTime}:00`).toISOString();
      const endAt = new Date(`${date}T${endTime}:00`).toISOString();

      await calendarService.createEvent({
        title,
        description: description || undefined,
        startAt,
        endAt,
        category,
        isPending,
        assigneeId: assigneeId || undefined,
      });

      resetForm();
      setOpen(false);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível criar o evento.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <DialogTrigger
        render={
          <Button className="bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90" />
        }
      >
        <Plus className="size-4" />
        Novo Evento
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-[var(--atria-primary)]">
              Novo Evento
            </DialogTitle>
          </DialogHeader>

          <FieldGroup className="py-4">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <Field>
              <FieldLabel htmlFor="evt-title">Título</FieldLabel>
              <Input
                id="evt-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="evt-desc">Descrição</FieldLabel>
              <Input
                id="evt-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>

            <div className="grid grid-cols-3 gap-3">
              <Field>
                <FieldLabel htmlFor="evt-date">Data</FieldLabel>
                <Input
                  id="evt-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="evt-start">Início</FieldLabel>
                <Input
                  id="evt-start"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="evt-end">Fim</FieldLabel>
                <Input
                  id="evt-end"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="evt-cat">Categoria</FieldLabel>
                <select
                  id="evt-cat"
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as
                        | "meeting"
                        | "deadline"
                        | "publish"
                        | "other",
                    )
                  }
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                >
                  <option value="meeting">Reunião</option>
                  <option value="deadline">Prazo</option>
                  <option value="publish">Publicação</option>
                  <option value="other">Outro</option>
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="evt-assignee">Responsável</FieldLabel>
                <select
                  id="evt-assignee"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                >
                  <option value="">Nenhum</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPending}
                onChange={(e) => setIsPending(e.target.checked)}
                className="rounded"
              />
              Marcar como pendente
            </label>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90"
            >
              {loading ? "Salvando..." : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
