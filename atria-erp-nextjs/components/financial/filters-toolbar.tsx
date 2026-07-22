"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryBadge } from "@/components/financial/category-badge";
import { STATUS_LABELS } from "@/lib/financial-utils";
import type { FinanceCategory, TransactionFilters } from "@/services/types";

interface FiltersToolbarProps {
  filters: TransactionFilters;
  categories: FinanceCategory[];
  onChange: (filters: TransactionFilters) => void;
  onClear: () => void;
}

export function FiltersToolbar({
  filters,
  categories,
  onChange,
  onClear,
}: FiltersToolbarProps) {
  const hasActiveFilters =
    filters.search ||
    filters.categoryIds.length > 0 ||
    filters.status ||
    filters.type ||
    filters.startDate ||
    filters.endDate;

  function toggleCategory(categoryId: string) {
    const isSelected = filters.categoryIds.includes(categoryId);
    onChange({
      ...filters,
      categoryIds: isSelected
        ? filters.categoryIds.filter((id) => id !== categoryId)
        : [...filters.categoryIds, categoryId],
    });
  }

  return (
    <div className="sticky top-0 z-20 -mx-1 rounded-2xl border border-[var(--atria-primary)]/10 bg-white/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--atria-primary)]/40" />
            <Input
              value={filters.search}
              onChange={(e) =>
                onChange({ ...filters, search: e.target.value })
              }
              placeholder="Buscar por descrição..."
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={filters.status}
              onChange={(e) =>
                onChange({
                  ...filters,
                  status: e.target.value as TransactionFilters["status"],
                })
              }
              className="h-8 rounded-lg border border-[var(--atria-primary)]/20 bg-white px-2 text-sm text-[var(--atria-primary)]"
            >
              <option value="">Todos os status</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={filters.type}
              onChange={(e) =>
                onChange({
                  ...filters,
                  type: e.target.value as TransactionFilters["type"],
                })
              }
              className="h-8 rounded-lg border border-[var(--atria-primary)]/20 bg-white px-2 text-sm text-[var(--atria-primary)]"
            >
              <option value="">Todos os tipos</option>
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>

            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                onChange({ ...filters, startDate: e.target.value })
              }
              className="w-auto"
              aria-label="Data inicial"
            />
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                onChange({ ...filters, endDate: e.target.value })
              }
              className="w-auto"
              aria-label="Data final"
            />

            {hasActiveFilters && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClear}
                className="border-[var(--atria-primary)]/20"
              >
                <X className="size-4" />
                Limpar
              </Button>
            )}
          </div>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <CategoryBadge
                key={category.id}
                name={category.name}
                color={category.color}
                selected={filters.categoryIds.includes(category.id)}
                onClick={() => toggleCategory(category.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
