import {
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { FINANCE_COLORS, formatCurrency } from "@/lib/financial-utils";
import type { FinanceOverview } from "@/services/types";

interface KpiCardsProps {
  overview: FinanceOverview;
}

const KPI_CONFIG = [
  {
    key: "totalRevenue",
    label: "Receita Total",
    icon: ArrowUpRight,
    color: FINANCE_COLORS.income,
    getValue: (o: FinanceOverview) => formatCurrency(o.totalRevenue),
  },
  {
    key: "totalExpenses",
    label: "Despesas Totais",
    icon: ArrowDownRight,
    color: FINANCE_COLORS.expense,
    getValue: (o: FinanceOverview) => formatCurrency(o.totalExpenses),
  },
  {
    key: "netProfit",
    label: "Saldo Líquido",
    icon: TrendingUp,
    color: FINANCE_COLORS.balance,
    getValue: (o: FinanceOverview) => formatCurrency(o.netProfit),
  },
  {
    key: "pending",
    label: "A Receber / A Pagar",
    icon: Clock,
    color: FINANCE_COLORS.pending,
    getValue: (o: FinanceOverview) =>
      `${formatCurrency(o.pendingReceivables)} / ${formatCurrency(o.pendingPayables)}`,
    subtitle: "Pendências em aberto",
  },
] as const;

export function KpiCards({ overview }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {KPI_CONFIG.map((kpi) => {
        const Icon = kpi.icon;

        return (
          <Card
            key={kpi.key}
            className="relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm"
            style={{
              borderColor: kpi.color.border,
              boxShadow: `0 10px 30px -18px ${kpi.color.glow}`,
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-1"
              style={{
                background: `linear-gradient(90deg, ${kpi.color.primary}, ${kpi.color.dark})`,
              }}
            />

            <div
              className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full blur-2xl"
              style={{ backgroundColor: kpi.color.bg }}
            />

            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <div
                  className="rounded-xl p-2.5"
                  style={{
                    backgroundColor: kpi.color.bg,
                    color: kpi.color.dark,
                  }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={{
                    backgroundColor: kpi.color.bg,
                    color: kpi.color.dark,
                  }}
                >
                  {kpi.label.split(" ")[0]}
                </span>
              </div>

              <p
                className="text-2xl font-bold tracking-tight"
                style={{ color: kpi.color.dark }}
              >
                {kpi.getValue(overview)}
              </p>
              <p className="mt-1 text-xs font-medium text-[var(--atria-primary)]/55">
                {kpi.label}
              </p>
              {"subtitle" in kpi && kpi.subtitle && (
                <p className="mt-1 text-[0.7rem] text-[var(--atria-primary)]/40">
                  {kpi.subtitle}
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
