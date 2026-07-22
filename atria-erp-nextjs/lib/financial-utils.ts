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

export const STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-[var(--atria-accent)]/30 text-[var(--atria-primary)]",
  overdue: "bg-red-100 text-red-700",
} as const;

export const STATUS_LABELS = {
  paid: "Pago",
  pending: "Pendente",
  overdue: "Atrasado",
} as const;

export const TYPE_LABELS = {
  income: "Receita",
  expense: "Despesa",
} as const;

export const CATEGORY_TYPE_LABELS = {
  income: "Receita",
  expense: "Despesa",
} as const;

export const PRESET_COLORS = [
  "#004949",
  "#E8C39E",
  "#2D6A4F",
  "#40916C",
  "#D4A373",
  "#BC6C25",
  "#6C757D",
  "#E76F51",
  "#264653",
  "#F4A261",
];

export function getContrastColor(hex: string) {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#004949" : "#FFFFFF";
}
