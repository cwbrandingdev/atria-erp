"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/time-utils";
import type { ProfitabilityOverview } from "@/services/types";

interface TimesheetKpiCardsProps {
  data: ProfitabilityOverview;
}

export function TimesheetKpiCards({ data }: TimesheetKpiCardsProps) {
  const cards = [
    {
      label: "Total de Horas",
      value: `${data.totalHours}h`,
      sub: "registradas na equipe",
    },
    {
      label: "Receita Recorrente",
      value: formatCurrency(data.totalRevenue),
      sub: "contratos assinados",
    },
    {
      label: "Custo Operacional",
      value: formatCurrency(data.totalLaborCost),
      sub: `@ ${formatCurrency(data.avgHourlyRate)}/h médio`,
    },
    {
      label: "Lucro Estimado",
      value: formatCurrency(data.totalProfit),
      sub: "receita − custo de horas",
      highlight: data.totalProfit >= 0,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--atria-primary)]/50">
            {card.label}
          </p>
          <p
            className={`mt-1 text-2xl font-bold ${
              card.highlight === false
                ? "text-red-600"
                : card.highlight
                  ? "text-green-700"
                  : "text-[var(--atria-primary)]"
            }`}
          >
            {card.value}
          </p>
          <p className="mt-1 text-xs text-[var(--atria-primary)]/40">
            {card.sub}
          </p>
        </Card>
      ))}
    </div>
  );
}
