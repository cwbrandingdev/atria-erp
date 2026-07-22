import { apiRequest } from "./api";
import type {
  CreateCategoryInput,
  CreateTransactionInput,
  FinanceCategory,
  FinanceOverview,
  FinanceTransaction,
  PaginatedTransactions,
  SortOrder,
  TransactionSortField,
  UpdateCategoryInput,
} from "./types";

export async function getFinanceOverview(): Promise<FinanceOverview> {
  return apiRequest<FinanceOverview>("/finance/overview");
}

export async function getCashFlow(): Promise<
  Pick<
    FinanceOverview,
    | "totalRevenue"
    | "totalExpenses"
    | "netProfit"
    | "profitMargin"
    | "pendingReceivables"
    | "pendingPayables"
    | "monthlyCashFlow"
    | "expenseByCategory"
  >
> {
  return apiRequest("/finance/cash-flow");
}

export async function getCategories(
  type?: "income" | "expense",
): Promise<FinanceCategory[]> {
  const query = type ? `?type=${type.toUpperCase()}` : "";
  const categories = await apiRequest<
    { id: string; name: string; type: string; color: string }[]
  >(`/finance/categories${query}`);

  return categories.map((c) => ({
    ...c,
    type: c.type.toLowerCase() as "income" | "expense",
  }));
}

export async function createCategory(
  data: CreateCategoryInput,
): Promise<FinanceCategory> {
  const category = await apiRequest<{
    id: string;
    name: string;
    type: string;
    color: string;
  }>("/finance/categories", {
    method: "POST",
    body: {
      ...data,
      type: data.type.toUpperCase(),
    },
  });

  return {
    ...category,
    type: category.type.toLowerCase() as "income" | "expense",
  };
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryInput,
): Promise<FinanceCategory> {
  const category = await apiRequest<{
    id: string;
    name: string;
    type: string;
    color: string;
  }>(`/finance/categories/${id}`, {
    method: "PATCH",
    body: data,
  });

  return {
    ...category,
    type: category.type.toLowerCase() as "income" | "expense",
  };
}

export async function deleteCategory(id: string): Promise<void> {
  return apiRequest<void>(`/finance/categories/${id}`, {
    method: "DELETE",
  });
}

export async function getTransactions(params?: {
  page?: number;
  limit?: number;
  type?: "income" | "expense";
  status?: "paid" | "pending" | "overdue";
  categoryId?: string;
  categoryIds?: string[];
  from?: string;
  to?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: TransactionSortField;
  sortOrder?: SortOrder;
}): Promise<PaginatedTransactions> {
  const entries: [string, string][] = [];

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === "") continue;

    if (key === "categoryIds" && Array.isArray(value)) {
      if (value.length > 0) {
        entries.push(["categoryIds", value.join(",")]);
      }
      continue;
    }

    if (key === "type" || key === "status") {
      entries.push([key, String(value).toUpperCase()]);
      continue;
    }

    entries.push([key, String(value)]);
  }

  const query = new URLSearchParams(entries).toString();

  return apiRequest<PaginatedTransactions>(
    `/finance/transactions${query ? `?${query}` : ""}`,
  );
}

export async function createTransaction(
  data: CreateTransactionInput,
): Promise<FinanceTransaction> {
  return apiRequest<FinanceTransaction>("/finance/transactions", {
    method: "POST",
    body: {
      ...data,
      type: data.type.toUpperCase(),
      status: data.status?.toUpperCase(),
    },
  });
}

export async function updateTransaction(
  id: string,
  data: Partial<CreateTransactionInput>,
): Promise<FinanceTransaction> {
  const body: Record<string, unknown> = { ...data };
  if (data.type) body.type = data.type.toUpperCase();
  if (data.status) body.status = data.status.toUpperCase();

  return apiRequest<FinanceTransaction>(`/finance/transactions/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function deleteTransaction(id: string): Promise<void> {
  return apiRequest<void>(`/finance/transactions/${id}`, {
    method: "DELETE",
  });
}

export async function markTransactionAsPaid(
  id: string,
): Promise<FinanceTransaction> {
  return updateTransaction(id, { status: "paid" });
}
