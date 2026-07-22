"use client";

import { useCallback, useEffect, useState } from "react";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { FinanceWidget } from "@/components/dashboard/finance-widget";
import { ContentMetaWidget } from "@/components/dashboard/content-meta-widget";
import { CalendarTasksWidget } from "@/components/dashboard/calendar-tasks-widget";
import { dashboardService } from "@/services";
import type { DashboardOverview } from "@/services/types";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const overview = await dashboardService.getDashboardOverview();
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
      <p className="text-center text-sm text-[var(--atria-primary)]/50">
        Não foi possível carregar o dashboard.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <WelcomeHeader
        userName={data.user.name}
        notificationCount={data.user.notificationCount}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <FinanceWidget finance={data.finance} />
        <ContentMetaWidget data={data.contentAndMeta} />
      </div>

      <CalendarTasksWidget
        calendar={data.calendar}
        kanban={data.kanban}
      />
    </div>
  );
}
