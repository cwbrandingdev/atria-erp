"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/time-utils";
import type { ClientProfitability } from "@/services/types";

const PRIMARY = "#004949";
const ACCENT = "#E8C39E";

interface ProfitabilityChartProps {
  clients: ClientProfitability[];
}

export function ProfitabilityChart({ clients }: ProfitabilityChartProps) {
  const chartData = clients.slice(0, 8).map((c) => ({
    name: c.companyName.length > 12 ? `${c.companyName.slice(0, 12)}…` : c.companyName,
    receita: c.monthlyRevenue,
    custo: c.laborCost,
    lucro: c.profit,
  }));

  return (
    <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6">
      <h2 className="mb-4 font-semibold text-[var(--atria-primary)]">
        Receita vs. Custo Operacional por Cliente
      </h2>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={`${PRIMARY}15`} />
            <XAxis
              dataKey="name"
              stroke={`${PRIMARY}80`}
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke={PRIMARY}
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => formatCurrency(v)}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                borderRadius: "12px",
                border: `1px solid ${PRIMARY}20`,
              }}
            />
            <Legend />
            <Bar
              dataKey="receita"
              name="Receita"
              fill={PRIMARY}
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="custo"
              name="Custo (horas)"
              fill={`${ACCENT}`}
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Line
              type="monotone"
              dataKey="lucro"
              name="Lucro"
              stroke="#2D6A6A"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
