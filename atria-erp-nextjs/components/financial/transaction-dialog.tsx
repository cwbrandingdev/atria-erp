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
import { financeService, ApiError } from "@/services";
import type { FinanceCategory, FinanceTransaction } from "@/services/types";

interface TransactionDialogProps {
  transaction?: FinanceTransaction | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export function TransactionDialog({
  transaction,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
  trigger,
}: TransactionDialogProps) {
  const isEdit = Boolean(transaction);
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<FinanceCategory[]>([]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [status, setStatus] = useState<"paid" | "pending" | "overdue">(
    "pending",
  );
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (!open) return;

    if (transaction) {
      setDescription(transaction.description);
      setAmount(String(transaction.amount));
      setType(transaction.type);
      setStatus(transaction.status);
      setDate(transaction.date.split("T")[0]);
      setCategoryId(transaction.categoryId);
    } else {
      resetForm();
    }
  }, [open, transaction]);

  useEffect(() => {
    if (!open) return;

    financeService
      .getCategories(type)
      .then((cats) => {
        setCategories(cats);
        if (!transaction) {
          setCategoryId(cats[0]?.id ?? "");
        } else if (!cats.some((cat) => cat.id === categoryId)) {
          setCategoryId(cats[0]?.id ?? "");
        }
      })
      .catch(() => setCategories([]));
  }, [open, type, transaction, categoryId]);

  function resetForm() {
    setDescription("");
    setAmount("");
    setType("income");
    setStatus("pending");
    setDate(new Date().toISOString().split("T")[0]);
    setCategoryId("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      description,
      amount: parseFloat(amount),
      type,
      status,
      date: new Date(date).toISOString(),
      categoryId,
    };

    try {
      if (isEdit && transaction) {
        await financeService.updateTransaction(transaction.id, payload);
      } else {
        await financeService.createTransaction(payload);
      }

      resetForm();
      setOpen(false);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : `Não foi possível ${isEdit ? "atualizar" : "criar"} a transação.`,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) resetForm();
      }}
    >
      {trigger !== undefined ? (
        trigger && (
          <DialogTrigger render={trigger as React.ReactElement} />
        )
      ) : !isEdit ? (
        <DialogTrigger
          render={
            <Button className="bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90" />
          }
        >
          <Plus className="size-4" />
          Nova Transação
        </DialogTrigger>
      ) : null}

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-[var(--atria-primary)]">
              {isEdit ? "Editar Transação" : "Adicionar Transação"}
            </DialogTitle>
          </DialogHeader>

          <FieldGroup className="py-4">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <Field>
              <FieldLabel htmlFor="tx-description">Descrição</FieldLabel>
              <Input
                id="tx-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="tx-amount">Valor (R$)</FieldLabel>
                <Input
                  id="tx-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="tx-type">Tipo</FieldLabel>
                <select
                  id="tx-type"
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value as "income" | "expense")
                  }
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                >
                  <option value="income">Receita</option>
                  <option value="expense">Despesa</option>
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="tx-date">Data</FieldLabel>
                <Input
                  id="tx-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="tx-status">Status</FieldLabel>
                <select
                  id="tx-status"
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as "paid" | "pending" | "overdue",
                    )
                  }
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                >
                  <option value="paid">Pago</option>
                  <option value="pending">Pendente</option>
                  <option value="overdue">Atrasado</option>
                </select>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="tx-category">Categoria</FieldLabel>
              <select
                id="tx-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </Field>
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
              disabled={loading || !categoryId}
              className="bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90"
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
