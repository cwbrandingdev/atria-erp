"use client";

import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import {
  FINANCE_COLORS,
  formatChartMonth,
  formatCompactCurrency,
  formatMonthKey,
  type FinancePeriod,
} from "@/lib/financial-utils";

interface CashFlowChartProps {
  data: { month: string; income: number; expense: number }[];
  period: FinancePeriod;
}

export function CashFlowChart({ data, period }: CashFlowChartProps) {
  const activeMonthKey = formatMonthKey(period);

  const chartData = data.map((item) => ({
    ...item,
    label: formatChartMonth(item.month),
    isActive: item.month === activeMonthKey,
  }));

  return (
    <Card className="overflow-hidden rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_12px_40px_-24px_rgba(16,185,129,0.45)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-[var(--atria-primary)]">
            Fluxo de Caixa Mensal
          </h2>
          <p className="text-xs text-[var(--atria-primary)]/45">
            Receitas e despesas por mês em {period.year}
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="size-2.5 rounded-full bg-emerald-500" />
            Receitas
          </span>
          <span className="flex items-center gap-1.5 text-red-600">
            <span className="size-2.5 rounded-full bg-red-500" />
            Despesas
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="label"
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => formatCompactCurrency(value)}
            />
            <Tooltip
              formatter={(value) =>
                formatCompactCurrency(
                  typeof value === "number" ? value : Number(value),
                )
              }
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
              }}
            />
            <Legend />
            <Bar dataKey="income" name="Receita" radius={[6, 6, 0, 0]} barSize={22}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.month}
                  fill={
                    entry.isActive
                      ? FINANCE_COLORS.income.primary
                      : "rgba(16, 185, 129, 0.45)"
                  }
                  stroke={entry.isActive ? FINANCE_COLORS.income.dark : "none"}
                  strokeWidth={entry.isActive ? 2 : 0}
                />
              ))}
            </Bar>
            <Area
              type="monotone"
              dataKey="expense"
              name="Despesa"
              stroke={FINANCE_COLORS.expense.primary}
              fill={FINANCE_COLORS.expense.primary}
              fillOpacity={0.22}
              strokeWidth={2.5}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
