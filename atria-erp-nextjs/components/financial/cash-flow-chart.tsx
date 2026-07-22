"use client";

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";

const MONTH_LABELS: Record<string, string> = {
  "01": "Jan",
  "02": "Fev",
  "03": "Mar",
  "04": "Abr",
  "05": "Mai",
  "06": "Jun",
  "07": "Jul",
  "08": "Ago",
  "09": "Set",
  "10": "Out",
  "11": "Nov",
  "12": "Dez",
};

function formatMonth(month: string) {
  const [, m] = month.split("-");
  return MONTH_LABELS[m] ?? month;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

interface CashFlowChartProps {
  data: { month: string; income: number; expense: number }[];
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: formatMonth(item.month),
  }));

  return (
    <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6">
      <h2 className="mb-4 font-semibold text-[var(--atria-primary)]">
        Fluxo de Caixa Mensal
      </h2>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00494910" />
            <XAxis
              dataKey="label"
              stroke="#00494980"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#00494980"
              fontSize={12}
              tickLine={false}
              tickFormatter={(v) => formatCurrency(v)}
            />
            <Tooltip
              formatter={(value) =>
                formatCurrency(typeof value === "number" ? value : Number(value))
              }
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #00494920",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            />
            <Legend />
            <Bar
              dataKey="income"
              name="Receita"
              fill="#004949"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Despesa"
              stroke="#E8C39E"
              fill="#E8C39E"
              fillOpacity={0.4}
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
