import {
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  Scale,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/financial-utils";
import type { FinanceOverview } from "@/services/types";

interface KpiCardsProps {
  overview: FinanceOverview;
}

export function KpiCards({ overview }: KpiCardsProps) {
  const kpis = [
    {
      key: "totalRevenue",
      label: "Receita Total",
      value: formatCurrency(overview.totalRevenue),
      icon: ArrowUpRight,
      highlight: false,
    },
    {
      key: "totalExpenses",
      label: "Despesas Totais",
      value: formatCurrency(overview.totalExpenses),
      icon: ArrowDownRight,
      highlight: false,
    },
    {
      key: "netProfit",
      label: "Saldo Líquido",
      value: formatCurrency(overview.netProfit),
      icon: TrendingUp,
      highlight: true,
    },
    {
      key: "pending",
      label: "A Receber / A Pagar",
      value: `${formatCurrency(overview.pendingReceivables)} / ${formatCurrency(overview.pendingPayables)}`,
      icon: Clock,
      highlight: true,
      subtitle: "Pendências em aberto",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;

        return (
          <Card
            key={kpi.key}
            className={`rounded-2xl border p-5 ${
              kpi.highlight
                ? "border-[var(--atria-accent)]/40 bg-[var(--atria-accent)]/10"
                : "border-[var(--atria-primary)]/10 bg-white"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <div
                className={`rounded-xl p-2 ${
                  kpi.highlight
                    ? "bg-[var(--atria-primary)] text-white"
                    : "bg-[var(--atria-accent)]/30 text-[var(--atria-primary)]"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              {kpi.key === "netProfit" && (
                <Scale className="size-4 text-[var(--atria-primary)]/30" />
              )}
            </div>
            <p className="text-xl font-bold text-[var(--atria-primary)]">
              {kpi.value}
            </p>
            <p className="text-xs text-[var(--atria-primary)]/50">{kpi.label}</p>
            {"subtitle" in kpi && kpi.subtitle && (
              <p className="mt-1 text-[0.7rem] text-[var(--atria-primary)]/40">
                {kpi.subtitle}
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}
