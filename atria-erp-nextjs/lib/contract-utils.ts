import type { ContractStatus } from "@/services/types";

export const STATUS_LABELS: Record<ContractStatus, string> = {
  draft: "Rascunho",
  sent: "Enviado",
  signed: "Assinado",
  expired: "Expirado",
  cancelled: "Cancelado",
};

export const STATUS_STYLES: Record<ContractStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-[var(--atria-accent)]/40 text-[var(--atria-primary)]",
  signed: "bg-green-100 text-green-700",
  expired: "bg-orange-100 text-orange-800",
  cancelled: "bg-red-100 text-red-700",
};

export const FREQUENCY_LABELS = {
  monthly: "Mensal",
  one_time: "Único",
} as const;

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
