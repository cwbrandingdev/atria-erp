"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

interface ExpenseDistributionChartProps {
  data: {
    categoryId: string;
    categoryName: string;
    amount: number;
    color: string;
  }[];
}

const FALLBACK_COLORS = ["#004949", "#E8C39E", "#006666", "#2D6A6A", "#8B7355"];

export function ExpenseDistributionChart({
  data,
}: ExpenseDistributionChartProps) {
  const chartData = data.map((item, index) => ({
    name: item.categoryName,
    value: item.amount,
    color: item.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
  }));

  return (
    <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6">
      <h2 className="mb-4 font-semibold text-[var(--atria-primary)]">
        Despesas por Categoria
      </h2>
      {chartData.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-sm text-[var(--atria-primary)]/40">
          Nenhuma despesa registrada
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {chartData.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-1.5 text-xs text-[var(--atria-primary)]/70"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
