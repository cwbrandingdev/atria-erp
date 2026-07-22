"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryBadge } from "@/components/financial/category-badge";
import { TransactionDialog } from "@/components/financial/transaction-dialog";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  formatDate,
  STATUS_LABELS,
  STATUS_STYLES,
} from "@/lib/financial-utils";
import { financeService, ApiError } from "@/services";
import type {
  FinanceTransaction,
  PaginatedTransactions,
  SortOrder,
  TransactionFilters,
  TransactionSortField,
} from "@/services/types";

interface TransactionsTableProps {
  transactions: PaginatedTransactions;
  filters: TransactionFilters;
  onSortChange: (sortBy: TransactionSortField, sortOrder: SortOrder) => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  loading?: boolean;
}

const SORTABLE_COLUMNS: {
  key: TransactionSortField;
  label: string;
}[] = [
  { key: "description", label: "Descrição" },
  { key: "date", label: "Data" },
  { key: "status", label: "Status" },
  { key: "amount", label: "Valor" },
];

export function TransactionsTable({
  transactions,
  filters,
  onSortChange,
  onPageChange,
  onRefresh,
  loading,
}: TransactionsTableProps) {
  const { data, meta } = transactions;
  const [editingTransaction, setEditingTransaction] =
    useState<FinanceTransaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<FinanceTransaction | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  function toggleSort(column: TransactionSortField) {
    if (filters.sortBy === column) {
      onSortChange(column, filters.sortOrder === "asc" ? "desc" : "asc");
      return;
    }

    onSortChange(column, "desc");
  }

  function SortIcon({ column }: { column: TransactionSortField }) {
    if (filters.sortBy !== column) return null;
    return filters.sortOrder === "asc" ? (
      <ArrowUp className="ml-1 inline size-3" />
    ) : (
      <ArrowDown className="ml-1 inline size-3" />
    );
  }

  async function handleDelete() {
    if (!deletingTransaction) return;

    setActionLoading(true);
    setActionError(null);

    try {
      await financeService.deleteTransaction(deletingTransaction.id);
      setDeletingTransaction(null);
      onRefresh();
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível excluir a transação.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleMarkAsPaid(transaction: FinanceTransaction) {
    setActionLoading(true);

    try {
      await financeService.markTransactionAsPaid(transaction.id);
      onRefresh();
    } catch {
      // silently fail; user can retry from menu
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <>
      <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6">
        <div className="mb-4">
          <h2 className="font-semibold text-[var(--atria-primary)]">
            Transações
          </h2>
          <p className="text-sm text-[var(--atria-primary)]/50">
            {meta.total} registro{meta.total === 1 ? "" : "s"} encontrado
            {meta.total === 1 ? "" : "s"}
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              {SORTABLE_COLUMNS.map((column) => (
                <TableHead
                  key={column.key}
                  className={`text-[var(--atria-primary)]/50 ${
                    column.key === "amount" ? "text-right" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(column.key)}
                    className="inline-flex items-center font-medium hover:text-[var(--atria-primary)]"
                  >
                    {column.label}
                    <SortIcon column={column.key} />
                  </button>
                </TableHead>
              ))}
              <TableHead className="text-[var(--atria-primary)]/50">
                Categoria
              </TableHead>
              <TableHead className="w-12 text-[var(--atria-primary)]/50" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  Carregando...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  Nenhuma transação encontrada
                </TableCell>
              </TableRow>
            ) : (
              data.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium text-[var(--atria-primary)]">
                    {tx.description}
                  </TableCell>
                  <TableCell className="text-[var(--atria-primary)]/60">
                    {formatDate(tx.date)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={STATUS_STYLES[tx.status]}
                      variant="outline"
                    >
                      {STATUS_LABELS[tx.status]}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      tx.type === "income" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {tx.type === "expense" ? "−" : "+"}
                    {formatCurrency(tx.amount)}
                  </TableCell>
                  <TableCell>
                    <CategoryBadge
                      name={tx.category}
                      color={tx.categoryColor ?? "#004949"}
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon-sm" disabled={actionLoading} />
                        }
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingTransaction(tx)}
                        >
                          <Pencil className="size-4" />
                          Editar
                        </DropdownMenuItem>
                        {tx.status !== "paid" && (
                          <DropdownMenuItem
                            onClick={() => handleMarkAsPaid(tx)}
                          >
                            <CheckCircle2 className="size-4" />
                            Marcar como pago
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeletingTransaction(tx)}
                        >
                          <Trash2 className="size-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {meta.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-[var(--atria-primary)]/50">
              Página {meta.page} de {meta.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                disabled={meta.page <= 1}
                onClick={() => onPageChange(meta.page - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                disabled={meta.page >= meta.totalPages}
                onClick={() => onPageChange(meta.page + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <TransactionDialog
        transaction={editingTransaction}
        open={Boolean(editingTransaction)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setEditingTransaction(null);
        }}
        onSuccess={() => {
          setEditingTransaction(null);
          onRefresh();
        }}
      />

      <Dialog
        open={Boolean(deletingTransaction)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDeletingTransaction(null);
            setActionError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[var(--atria-primary)]">
              Excluir transação
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[var(--atria-primary)]/70">
            Tem certeza que deseja excluir &quot;
            {deletingTransaction?.description}&quot;? Esta ação não pode ser
            desfeita.
          </p>
          {actionError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {actionError}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingTransaction(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={actionLoading}
              onClick={handleDelete}
            >
              {actionLoading ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
