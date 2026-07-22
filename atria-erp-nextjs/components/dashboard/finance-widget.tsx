"use client";

import Link from "next/link";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { DashboardOverview } from "@/services/types";

const PRIMARY = "#004949";
const ACCENT = "#E8C39E";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function formatMonth(month: string) {
  const [, m] = month.split("-");
  const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return labels[parseInt(m, 10) - 1] ?? month;
}

interface FinanceWidgetProps {
  finance: DashboardOverview["finance"];
}

export function FinanceWidget({ finance }: FinanceWidgetProps) {
  const chartData = finance.monthlyTrend.map((point) => ({
    ...point,
    label: formatMonth(point.month),
    net: point.income - point.expense,
  }));

  return (
    <Card className="flex h-full flex-col rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[var(--atria-accent)]/30 p-2 text-[var(--atria-primary)]">
            <DollarSign className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--atria-primary)]">
              Financeiro
            </h2>
            <p className="text-xs text-[var(--atria-primary)]/50">
              Receita, despesas e tendência
            </p>
          </div>
        </div>
        <Link
          href="/financial"
          className="flex items-center gap-1 text-xs font-medium text-[var(--atria-primary)] hover:underline"
        >
          Ver mais <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div>
          <p className="text-lg font-bold text-[var(--atria-primary)]">
            {formatCurrency(finance.revenue)}
          </p>
          <p className="text-[10px] text-[var(--atria-primary)]/50">Receita</p>
        </div>
        <div>
          <p className="text-lg font-bold text-red-500">
            {formatCurrency(finance.expenses)}
          </p>
          <p className="text-[10px] text-[var(--atria-primary)]/50">Despesas</p>
        </div>
        <div>
          <p
            className={`text-lg font-bold ${
              finance.netProfit >= 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {formatCurrency(finance.netProfit)}
          </p>
          <p className="text-[10px] text-[var(--atria-primary)]/50">Lucro</p>
        </div>
      </div>

      <div className="h-28 w-full flex-1 sm:h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="label"
              stroke={`${PRIMARY}60`}
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis hide />
            <Tooltip
              formatter={(value) =>
                formatCurrency(typeof value === "number" ? value : Number(value))
              }
              contentStyle={{
                borderRadius: "12px",
                border: `1px solid ${PRIMARY}20`,
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="income"
              name="Receita"
              stroke={PRIMARY}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="Despesa"
              stroke={ACCENT}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
