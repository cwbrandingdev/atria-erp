"use client";

import { useCallback, useEffect, useState } from "react";
import { BarChart2 } from "lucide-react";
import { InsightsMetrics } from "@/components/insights/insights-metrics";
import { SpendConversionsChart } from "@/components/insights/spend-conversions-chart";
import { CampaignsTable } from "@/components/insights/campaigns-table";
import { insightsService } from "@/services";
import type {
  MetaCampaign,
  MetaInsightsOverview,
  MetaPerformancePoint,
} from "@/services/types";

export default function InsightsPage() {
  const [overview, setOverview] = useState<MetaInsightsOverview | null>(null);
  const [performance, setPerformance] = useState<MetaPerformancePoint[]>([]);
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [overviewData, performanceData, campaignsData] = await Promise.all([
        insightsService.getOverview(),
        insightsService.getPerformance(),
        insightsService.getCampaigns(),
      ]);
      setOverview(overviewData);
      setPerformance(performanceData);
      setCampaigns(campaignsData);
    } catch {
      setOverview(null);
      setPerformance([]);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  if (loading && !overview) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--atria-primary)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl border border-[var(--atria-primary)]/10 bg-[var(--atria-accent)]/20 p-3 text-[var(--atria-primary)]">
          <BarChart2 className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--atria-primary)]">
            Meta Insights
          </h1>
          <p className="text-sm text-[var(--atria-primary)]/50">
            Performance de campanhas, alcance e investimento em anúncios
          </p>
        </div>
      </div>

      {overview && <InsightsMetrics overview={overview} />}

      <SpendConversionsChart data={performance} />

      <CampaignsTable campaigns={campaigns} onUpdate={() => void loadData()} />
    </div>
  );
}
