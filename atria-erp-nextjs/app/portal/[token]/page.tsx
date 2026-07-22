"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Shield,
} from "lucide-react";
import { ReportExportView } from "@/components/reports/report-export-view";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FORMAT_LABELS,
  PLATFORM_LABELS,
  STATUS_LABELS,
  formatCurrency,
} from "@/lib/report-utils";
import { portalService } from "@/services";
import type { ClientReport, PortalData } from "@/services/types";

export default function ClientPortalPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ClientReport | null>(
    null,
  );
  const [loadingReport, setLoadingReport] = useState(false);

  const loadPortal = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const result = await portalService.getPortalData(token);
      setData(result);
    } catch {
      setError("Link inválido ou expirado. Entre em contato com sua agência.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadPortal();
  }, [loadPortal]);

  const openReport = async (reportId: string) => {
    if (!token) return;
    setLoadingReport(true);
    try {
      const report = await portalService.getPortalReport(token, reportId);
      setSelectedReport(report);
    } finally {
      setLoadingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F8F6]">
        <Loader2 className="size-8 animate-spin text-[#004949]" />
      </div>
    );
  }

  if (error || !data?.client) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8F8F6] p-6 text-center">
        <Shield className="size-12 text-[#004949]/30" />
        <h1 className="text-xl font-semibold text-[#004949]">
          Acesso não disponível
        </h1>
        <p className="max-w-md text-sm text-[#004949]/60">{error}</p>
      </div>
    );
  }

  const { client, accountStatus, pendingApprovalPosts, recentReports, contracts } =
    data;

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <header className="bg-[#004949] px-6 py-8 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium uppercase tracking-widest text-[#E8C39E]">
            Portal do Cliente
          </p>
          <h1 className="mt-1 text-2xl font-bold">{client.companyName}</h1>
          {client.contactName && (
            <p className="mt-1 text-white/70">{client.contactName}</p>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Contratos Ativos",
              value: accountStatus.activeContracts,
              icon: CheckCircle2,
            },
            {
              label: "Aguardando Aprovação",
              value: accountStatus.pendingApprovals,
              icon: Clock,
            },
            {
              label: "Posts Agendados",
              value: accountStatus.scheduledPosts,
              icon: FileText,
            },
            {
              label: "Posts Publicados",
              value: accountStatus.publishedPosts,
              icon: CheckCircle2,
            },
          ].map((item) => (
            <Card
              key={item.label}
              className="rounded-2xl border-[#004949]/10 bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#E8C39E]/20 p-2 text-[#004949]">
                  <item.icon className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-[#004949]/50">{item.label}</p>
                  <p className="text-xl font-bold text-[#004949]">
                    {item.value}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="mb-4 text-lg font-semibold text-[#004949]">
              Conteúdos Pendentes de Aprovação
            </h2>
            {pendingApprovalPosts.length === 0 ? (
              <Card className="rounded-2xl border-[#004949]/10 bg-white p-6 text-sm text-[#004949]/50">
                Nenhum conteúdo aguardando aprovação.
              </Card>
            ) : (
              <div className="space-y-3">
                {pendingApprovalPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="rounded-2xl border-[#004949]/10 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-[#004949]">
                          {post.title}
                        </p>
                        <p className="mt-1 text-xs text-[#004949]/50">
                          {PLATFORM_LABELS[post.platform] ?? post.platform} ·{" "}
                          {FORMAT_LABELS[post.format] ?? post.format}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#E8C39E]/30 px-2 py-0.5 text-xs font-medium text-[#004949]">
                        {STATUS_LABELS[post.status] ?? post.status}
                      </span>
                    </div>
                    {post.scheduledDate && (
                      <p className="mt-2 text-xs text-[#004949]/40">
                        Agendado:{" "}
                        {new Date(post.scheduledDate).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                    )}
                    {post.copy && (
                      <p className="mt-2 line-clamp-3 text-sm text-[#004949]/70">
                        {post.copy}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-[#004949]">
              Relatórios Recentes
            </h2>
            {recentReports.length === 0 ? (
              <Card className="rounded-2xl border-[#004949]/10 bg-white p-6 text-sm text-[#004949]/50">
                Nenhum relatório disponível ainda.
              </Card>
            ) : (
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <Card
                    key={report.id}
                    className="flex items-center justify-between rounded-2xl border-[#004949]/10 bg-white p-4"
                  >
                    <div>
                      <p className="font-medium text-[#004949]">
                        {report.periodLabel}
                      </p>
                      <p className="text-xs text-[#004949]/50">
                        Gerado em{" "}
                        {new Date(report.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#E8C39E] text-[#004949]"
                      onClick={() => void openReport(report.id)}
                      disabled={loadingReport}
                    >
                      Ver relatório
                    </Button>
                  </Card>
                ))}
              </div>
            )}

            {contracts.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-4 text-lg font-semibold text-[#004949]">
                  Contratos Ativos
                </h2>
                <div className="space-y-3">
                  {contracts.map((contract) => (
                    <Card
                      key={contract.id}
                      className="rounded-2xl border-[#004949]/10 bg-white p-4"
                    >
                      <p className="font-medium text-[#004949]">
                        {contract.title}
                      </p>
                      <p className="mt-1 text-sm text-[#004949]/60">
                        {formatCurrency(contract.recurringValue)} ·{" "}
                        {contract.paymentFrequency === "monthly"
                          ? "Mensal"
                          : "Único"}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Dialog
        open={!!selectedReport}
        onOpenChange={(open) => !open && setSelectedReport(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Relatório</DialogTitle>
          </DialogHeader>
          {selectedReport && <ReportExportView report={selectedReport} />}
        </DialogContent>
      </Dialog>

      <footer className="mt-12 border-t border-[#004949]/10 py-6 text-center text-xs text-[#004949]/40">
        ATRIA · Portal do Cliente · Acesso seguro
      </footer>
    </div>
  );
}
