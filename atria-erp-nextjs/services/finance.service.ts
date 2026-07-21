import { apiRequest } from "./api";
import type { FinanceOverview, FinanceTransaction } from "./types";

export async function getFinanceOverview(): Promise<FinanceOverview> {
  return apiRequest<FinanceOverview>("/finance/overview");
}

export async function getTransactions(params?: {
  type?: "income" | "expense";
  from?: string;
  to?: string;
}): Promise<FinanceTransaction[]> {
  const query = new URLSearchParams(
    Object.entries(params ?? {})
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)]),
  ).toString();

  return apiRequest<FinanceTransaction[]>(
    `/finance/transactions${query ? `?${query}` : ""}`,
  );
}

export async function createTransaction(
  data: Omit<FinanceTransaction, "id">,
): Promise<FinanceTransaction> {
  return apiRequest<FinanceTransaction>("/finance/transactions", {
    method: "POST",
    body: data,
  });
}

export async function updateTransaction(
  id: string,
  data: Partial<FinanceTransaction>,
): Promise<FinanceTransaction> {
  return apiRequest<FinanceTransaction>(`/finance/transactions/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteTransaction(id: string): Promise<void> {
  return apiRequest<void>(`/finance/transactions/${id}`, {
    method: "DELETE",
  });
}
