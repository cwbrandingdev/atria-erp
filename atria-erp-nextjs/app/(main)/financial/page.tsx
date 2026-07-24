"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { KpiCards } from "@/components/financial/kpi-cards";
import { CashFlowChart } from "@/components/financial/cash-flow-chart";
import { ExpenseDistributionChart } from "@/components/financial/expense-distribution-chart";
import { TransactionsTable } from "@/components/financial/transactions-table";
import { TransactionDialog } from "@/components/financial/transaction-dialog";
import { CategoryManagementDrawer } from "@/components/financial/category-management-drawer";
import { FiltersToolbar } from "@/components/financial/filters-toolbar";
import { MonthSwitcher } from "@/components/financial/month-switcher";
import { financeService } from "@/services";
import {
  getCurrentPeriod,
  getMonthBounds,
  type FinancePeriod,
} from "@/lib/financial-utils";
import type {
  FinanceCategory,
  FinanceOverview,
  PaginatedTransactions,
  TransactionFilters,
} from "@/services/types";

const emptyPaginated: PaginatedTransactions = {
  data: [],
  meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};

function buildDefaultFilters(period: FinancePeriod): TransactionFilters {
  const { startDate, endDate } = getMonthBounds(period);

  return {
    search: "",
    categoryIds: [],
    status: "",
    type: "",
    startDate,
    endDate,
    sortBy: "date",
    sortOrder: "desc",
  };
}

export default function FinancialPage() {
  const [period, setPeriod] = useState<FinancePeriod>(getCurrentPeriod);
  const [overview, setOverview] = useState<FinanceOverview | null>(null);
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [transactions, setTransactions] =
    useState<PaginatedTransactions>(emptyPaginated);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TransactionFilters>(() =>
    buildDefaultFilters(getCurrentPeriod()),
  );
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  const loadCategories = useCallback(async () => {
    try {
      const data = await financeService.getCategories();
      setCategories(data);
    } catch {
      setCategories([]);
    }
  }, []);

  const loadOverview = useCallback(async () => {
    setLoadingOverview(true);
    try {
      const data = await financeService.getFinanceOverview({
        month: period.month,
        year: period.year,
      });
      setOverview(data);
    } catch {
      setOverview(null);
    } finally {
      setLoadingOverview(false);
    }
  }, [period.month, period.year]);

  const transactionQuery = useMemo(
    () => ({
      page,
      limit: 10,
      search: debouncedSearch || undefined,
      categoryIds:
        filters.categoryIds.length > 0 ? filters.categoryIds : undefined,
      status: filters.status || undefined,
      type: filters.type || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    }),
    [page, debouncedSearch, filters],
  );

  const loadTransactions = useCallback(async () => {
    setLoadingTransactions(true);
    try {
      const data = await financeService.getTransactions(transactionQuery);
      setTransactions(data);
    } catch {
      setTransactions(emptyPaginated);
    } finally {
      setLoadingTransactions(false);
    }
  }, [transactionQuery]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  function handlePeriodChange(nextPeriod: FinancePeriod) {
    setPeriod(nextPeriod);
    setPage(1);
    setFilters((current) => ({
      ...current,
      ...getMonthBounds(nextPeriod),
    }));
  }

  function handleRefresh() {
    void loadCategories();
    void loadOverview();
    void loadTransactions();
  }

  function handleFiltersChange(nextFilters: TransactionFilters) {
    setFilters(nextFilters);
    setPage(1);
  }

  function handleClearFilters() {
    setFilters(buildDefaultFilters(period));
    setPage(1);
  }

  if (loadingOverview && !overview) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--atria-primary)]">
            Financeiro
          </h1>
          <p className="text-sm text-[var(--atria-primary)]/50">
            Receitas, despesas e fluxo de caixa com visão mensal
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CategoryManagementDrawer onCategoriesChange={handleRefresh} />
          <TransactionDialog onSuccess={handleRefresh} />
        </div>
      </div>

      <MonthSwitcher period={period} onChange={handlePeriodChange} />

      {overview && <KpiCards overview={overview} />}

      {overview && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <CashFlowChart data={overview.monthlyCashFlow} period={period} />
          <ExpenseDistributionChart data={overview.expenseByCategory} />
        </div>
      )}

      <FiltersToolbar
        filters={filters}
        categories={categories}
        onChange={handleFiltersChange}
        onClear={handleClearFilters}
      />

      <TransactionsTable
        transactions={transactions}
        filters={filters}
        onSortChange={(sortBy, sortOrder) =>
          handleFiltersChange({ ...filters, sortBy, sortOrder })
        }
        onPageChange={setPage}
        onRefresh={handleRefresh}
        loading={loadingTransactions}
      />
    </div>
  );
}
