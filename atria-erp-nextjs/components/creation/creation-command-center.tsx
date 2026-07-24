"use client";

import { useCallback, useEffect, useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { ApprovalsQueue } from "@/components/creation/approvals-queue";
import { BlockersAlerts } from "@/components/creation/blockers-alerts";
import { BriefToContentModal } from "@/components/creation/brief-to-content-modal";
import { CreationQuickActionBar } from "@/components/creation/quick-action-bar";
import { CreationStatsRow } from "@/components/creation/creation-stats-row";
import { DeliverablesGrid } from "@/components/creation/deliverables-grid";
import { PublishingSchedule } from "@/components/creation/publishing-schedule";
import { Button } from "@/components/ui/button";
import { creationService } from "@/services";
import type { CreationCommandCenter } from "@/services/types";

export function CreationCommandCenter() {
  const [data, setData] = useState<CreationCommandCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [briefOpen, setBriefOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await creationService.getCommandCenter();
      setData(result);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--atria-primary)] border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-[var(--atria-primary)]/60">
          Não foi possível carregar o Command Center.
        </p>
        <button
          type="button"
          onClick={() => void loadData()}
          className="rounded-lg bg-[var(--atria-primary)] px-4 py-2 text-sm text-white"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex flex-col gap-6 pb-24">
        <div
          className="pointer-events-none absolute inset-x-0 -top-6 h-48 rounded-3xl opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at top, var(--atria-accent) 0%, transparent 70%)",
          }}
        />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="size-5 text-[var(--atria-accent)]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--atria-primary)]/40">
                Mission Control
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--atria-primary)]">
              Creation Command Center
            </h1>
            <p className="text-sm text-[var(--atria-primary)]/50">
              Visão unificada para copywriters, designers e equipe criativa
            </p>
          </div>
          <Button
            onClick={() => setBriefOpen(true)}
            className="gap-2 bg-gradient-to-r from-[var(--atria-primary)] to-[#7C3AED] text-white shadow-md"
          >
            <Wand2 className="size-4" />
            Brief → Conteúdo
          </Button>
        </div>

        <CreationStatsRow stats={data.stats} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <DeliverablesGrid
            groups={data.deliverables.groups}
            weekRange={data.weekRange}
            summary={data.deliverables.summary}
          />
          <ApprovalsQueue items={data.approvalsQueue} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <PublishingSchedule items={data.publishingSchedule} />
          </div>
          <BlockersAlerts blockers={data.blockers} />
        </div>
      </div>

      <CreationQuickActionBar onBriefSuccess={() => void loadData()} />

      <BriefToContentModal
        open={briefOpen}
        onOpenChange={setBriefOpen}
        onSuccess={() => void loadData()}
      />
    </>
  );
}
