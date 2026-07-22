"use client";

import { useCallback, useEffect, useState } from "react";
import { HoursSummaryTables } from "@/components/timesheet/hours-summary-tables";
import { ProfitabilityChart } from "@/components/timesheet/profitability-chart";
import { ProfitabilityTable } from "@/components/timesheet/profitability-table";
import { TimesheetKpiCards } from "@/components/timesheet/timesheet-kpi-cards";
import { timesheetService } from "@/services";
import type { ProfitabilityOverview } from "@/services/types";

export default function TimesheetPage() {
  const [data, setData] = useState<ProfitabilityOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const overview = await timesheetService.getProfitabilityOverview();
      setData(overview);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  if (loading && !data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--atria-primary)] border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-[var(--atria-primary)]/50">
        Não foi possível carregar os dados de timesheet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--atria-primary)]">
          Timesheet & Rentabilidade
        </h1>
        <p className="text-sm text-[var(--atria-primary)]/50">
          Horas registradas, custo operacional e lucratividade por cliente
        </p>
      </div>

      <TimesheetKpiCards data={data} />

      <ProfitabilityChart clients={data.clients} />

      <HoursSummaryTables
        byMember={data.teamSummary.byMember}
        byClient={data.teamSummary.byClient}
      />

      <ProfitabilityTable clients={data.clients} />
    </div>
  );
}
