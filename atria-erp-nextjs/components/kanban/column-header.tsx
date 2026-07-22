"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { kanbanService, ApiError } from "@/services";
import type { KanbanColumn } from "@/services/types";

interface ColumnHeaderProps {
  column: KanbanColumn;
  taskCount: number;
  onUpdate: () => void;
}

export function ColumnHeader({ column, taskCount, onUpdate }: ColumnHeaderProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRename(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await kanbanService.updateColumn(column.id, { title });
      setRenameOpen(false);
      onUpdate();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível renomear a coluna.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Excluir a coluna "${column.title}"?`)) return;

    try {
      await kanbanService.deleteColumn(column.id);
      onUpdate();
    } catch (err) {
      alert(
        err instanceof ApiError
          ? err.message
          : "Não foi possível excluir a coluna.",
      );
    }
  }

  return (
    <>
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h2 className="text-sm font-semibold text-[var(--atria-primary)]">
            {column.title}
          </h2>
          <span className="rounded-full bg-[var(--atria-accent)]/30 px-2 py-0.5 text-xs font-medium text-[var(--atria-primary)]">
            {taskCount}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" />}
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setTitle(column.title);
                setRenameOpen(true);
              }}
            >
              <Pencil className="size-4" />
              Renomear
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              <Trash2 className="size-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleRename}>
            <DialogHeader>
              <DialogTitle className="text-[var(--atria-primary)]">
                Renomear coluna
              </DialogTitle>
            </DialogHeader>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="my-4"
              required
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRenameOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[var(--atria-primary)] text-white"
              >
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
