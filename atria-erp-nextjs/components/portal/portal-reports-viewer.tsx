"use client";

import { useState } from "react";
import { BarChart3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReportExportView } from "@/components/reports/report-export-view";
import { portalService } from "@/services";
import type { ClientReport, PortalReportSummary } from "@/services/types";

interface PortalReportsViewerProps {
  token: string;
  reports: PortalReportSummary[];
}

export function PortalReportsViewer({
  token,
  reports,
}: PortalReportsViewerProps) {
  const [selectedReport, setSelectedReport] = useState<ClientReport | null>(
    null,
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function openReport(reportId: string) {
    setLoadingId(reportId);
    try {
      const report = await portalService.getPortalReport(token, reportId);
      setSelectedReport(report);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {reports.length === 0 ? (
          <Card className="rounded-2xl border-[var(--atria-primary)]/10 bg-white p-8 text-center text-sm text-[var(--atria-primary)]/50">
            Nenhum relatório disponível ainda.
          </Card>
        ) : (
          reports.map((report) => (
            <Card
              key={report.id}
              className="flex items-center justify-between rounded-2xl border-[var(--atria-primary)]/10 bg-white p-5"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[var(--atria-primary)]/10 p-2.5">
                  <BarChart3 className="size-5 text-[var(--atria-primary)]" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--atria-primary)]">
                    {report.periodLabel}
                  </p>
                  <p className="text-xs text-[var(--atria-primary)]/50">
                    {report.title}
                  </p>
                  <p className="text-[10px] text-[var(--atria-primary)]/40">
                    Gerado em{" "}
                    {new Date(report.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={loadingId === report.id}
                onClick={() => void openReport(report.id)}
              >
                {loadingId === report.id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Ver relatório"
                )}
              </Button>
            </Card>
          ))
        )}
      </div>

      <Dialog
        open={!!selectedReport}
        onOpenChange={(open) => !open && setSelectedReport(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Relatório de performance</DialogTitle>
          </DialogHeader>
          {selectedReport && <ReportExportView report={selectedReport} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
