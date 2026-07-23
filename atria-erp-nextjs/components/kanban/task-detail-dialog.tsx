"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TaskTimer } from "@/components/kanban/task-timer";
import { getInitials, PRIORITY_LABELS } from "@/lib/kanban-utils";
import { toast } from "@/lib/toast";
import {
  calendarService,
  clientsService,
  kanbanService,
  ApiError,
} from "@/services";
import type {
  Client,
  KanbanColumn,
  KanbanPriority,
  KanbanTask,
  TaskComment,
  TaskHistoryEntry,
  TeamMember,
  TimeLog,
} from "@/services/types";

type DetailTab = "details" | "comments" | "history";

interface TaskDetailDialogProps {
  task: KanbanTask | null;
  columns: KanbanColumn[];
  open: boolean;
  activeTimer: TimeLog | null;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function TaskDetailDialog({
  task,
  columns,
  open,
  activeTimer,
  onOpenChange,
  onUpdate,
}: TaskDetailDialogProps) {
  const [tab, setTab] = useState<DetailTab>("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [history, setHistory] = useState<TaskHistoryEntry[]>([]);
  const [commentText, setCommentText] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<KanbanPriority>("medium");
  const [columnId, setColumnId] = useState("");
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [clientId, setClientId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [totalLoggedSeconds, setTotalLoggedSeconds] = useState(0);

  useEffect(() => {
    if (!open || !task) return;

    setTitle(task.title);
    setDescription(task.description ?? "");
    setPriority(task.priority);
    setColumnId(task.columnId);
    setAssigneeIds(task.assignees.map((a) => a.id));
    setClientId(task.clientId ?? "");
    setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setTotalLoggedSeconds(task.totalLoggedSeconds);
    setTab("details");
    setCommentText("");
    setError(null);

    calendarService.getTeamMembers().then(setMembers).catch(() => setMembers([]));
    clientsService.getClients().then(setClients).catch(() => setClients([]));
    void loadComments(task.id);
    void loadHistory(task.id);
  }, [open, task]);

  async function loadComments(taskId: string) {
    try {
      const data = await kanbanService.getComments(taskId);
      setComments(data);
    } catch {
      setComments([]);
    }
  }

  async function loadHistory(taskId: string) {
    try {
      const data = await kanbanService.getHistory(taskId);
      setHistory(data);
    } catch {
      setHistory([]);
    }
  }

  function toggleAssignee(id: string) {
    setAssigneeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!task) return;

    setLoading(true);
    setError(null);

    try {
      await kanbanService.updateTask(task.id, {
        title,
        description,
        priority,
        columnId,
        assigneeIds,
        clientId: clientId || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
      onUpdate();
      onOpenChange(false);
      toast.success("Tarefa atualizada");
    } catch (err) {
      if (!(err instanceof ApiError)) {
        setError("Não foi possível atualizar a tarefa.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!task || !confirm("Excluir esta tarefa?")) return;

    setLoading(true);
    try {
      await kanbanService.deleteTask(task.id);
      onUpdate();
      onOpenChange(false);
      toast.info("Tarefa removida");
    } catch (err) {
      if (!(err instanceof ApiError)) {
        setError("Não foi possível excluir a tarefa.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!task || !commentText.trim()) return;

    setLoading(true);
    try {
      await kanbanService.createComment(task.id, commentText.trim());
      setCommentText("");
      await loadComments(task.id);
      await loadHistory(task.id);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível adicionar o comentário.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[var(--atria-primary)]">
            Detalhes da Tarefa
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 border-b border-[var(--atria-primary)]/10 pb-3">
          {(
            [
              ["details", "Detalhes"],
              ["comments", "Comentários"],
              ["history", "Histórico"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === key
                  ? "bg-[var(--atria-accent)] text-[var(--atria-primary)]"
                  : "text-[var(--atria-primary)]/60 hover:bg-[var(--atria-primary)]/5"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex-1 overflow-y-auto py-2">
          {tab === "details" && (
            <form id="task-detail-form" onSubmit={handleSave}>
              <div className="mb-4">
                <TaskTimer
                  taskId={task.id}
                  totalLoggedSeconds={totalLoggedSeconds}
                  activeTimer={activeTimer}
                  onUpdate={async () => {
                    const updated = await kanbanService.getTask(task.id);
                    setTotalLoggedSeconds(updated.totalLoggedSeconds);
                    onUpdate();
                  }}
                />
              </div>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="detail-title">Título</FieldLabel>
                  <Input
                    id="detail-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="detail-desc">Descrição</FieldLabel>
                  <textarea
                    id="detail-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="detail-column">Coluna</FieldLabel>
                    <select
                      id="detail-column"
                      value={columnId}
                      onChange={(e) => setColumnId(e.target.value)}
                      className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                    >
                      {columns.map((column) => (
                        <option key={column.id} value={column.id}>
                          {column.title}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="detail-priority">Prioridade</FieldLabel>
                    <select
                      id="detail-priority"
                      value={priority}
                      onChange={(e) =>
                        setPriority(e.target.value as KanbanPriority)
                      }
                      className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                    >
                      {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="detail-due">Prazo</FieldLabel>
                  <Input
                    id="detail-due"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="detail-client">Cliente</FieldLabel>
                  <select
                    id="detail-client"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                  >
                    <option value="">Sem cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.companyName}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field>
                  <FieldLabel>Responsáveis</FieldLabel>
                  <div className="max-h-36 space-y-2 overflow-y-auto rounded-lg border border-input p-2">
                    {members.map((member) => (
                      <label
                        key={member.id}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={assigneeIds.includes(member.id)}
                          onChange={() => toggleAssignee(member.id)}
                        />
                        {member.name}
                      </label>
                    ))}
                  </div>
                </Field>
              </FieldGroup>
            </form>
          )}

          {tab === "comments" && (
            <div className="flex flex-col gap-4">
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-sm text-[var(--atria-primary)]/50">
                    Nenhum comentário ainda.
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-xl border border-[var(--atria-primary)]/10 p-3"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <Avatar className="size-7">
                          {comment.user.avatarUrl && (
                            <AvatarImage src={comment.user.avatarUrl} />
                          )}
                          <AvatarFallback className="bg-[var(--atria-accent)] text-[10px] text-[var(--atria-primary)]">
                            {getInitials(comment.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-[var(--atria-primary)]">
                            {comment.user.name}
                          </p>
                          <p className="text-[10px] text-[var(--atria-primary)]/40">
                            {new Date(comment.createdAt).toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--atria-primary)]/80">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escreva um comentário..."
                />
                <Button
                  type="submit"
                  disabled={loading || !commentText.trim()}
                  className="bg-[var(--atria-primary)] text-white"
                >
                  Enviar
                </Button>
              </form>
            </div>
          )}

          {tab === "history" && (
            <div className="space-y-3">
              {history.length === 0 ? (
                <p className="text-sm text-[var(--atria-primary)]/50">
                  Nenhuma atividade registrada.
                </p>
              ) : (
                history.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex gap-3 rounded-xl border border-[var(--atria-primary)]/10 p-3"
                  >
                    <Avatar className="size-8 shrink-0">
                      {entry.user.avatarUrl && (
                        <AvatarImage src={entry.user.avatarUrl} />
                      )}
                      <AvatarFallback className="bg-[var(--atria-accent)] text-[10px] text-[var(--atria-primary)]">
                        {getInitials(entry.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-[var(--atria-primary)]">
                        <span className="font-medium">{entry.user.name}</span>{" "}
                        {entry.action}
                      </p>
                      <p className="text-[10px] text-[var(--atria-primary)]/40">
                        {new Date(entry.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={loading}
          >
            <Trash2 className="size-4" />
            Excluir
          </Button>

          {tab === "details" && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="task-detail-form"
                disabled={loading}
                className="bg-[var(--atria-primary)] text-white"
              >
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
