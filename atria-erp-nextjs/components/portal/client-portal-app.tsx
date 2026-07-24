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
import { PortalApprovalHub } from "@/components/portal/portal-approval-hub";
import { PortalAssetsDropzone } from "@/components/portal/portal-assets-dropzone";
import { PortalContractsCenter } from "@/components/portal/portal-contracts-center";
import { PortalReportsViewer } from "@/components/portal/portal-reports-viewer";
import { PortalShell } from "@/components/portal/portal-shell";
import {
  PortalTabPills,
  type PortalTab,
} from "@/components/portal/portal-tab-pills";
import { Card } from "@/components/ui/card";
import { portalService } from "@/services";
import type { PortalData } from "@/services/types";

export function ClientPortalApp() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PortalTab>("approval");

  const loadPortal = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const result = await portalService.getPortalData(token);
      setData(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Link inválido ou expirado.";
      setError(
        message.includes("expired")
          ? "Este link expirou. Solicite um novo link à sua agência."
          : "Link inválido ou revogado. Entre em contato com sua agência.",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadPortal();
  }, [loadPortal]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--atria-base,#F8F8F6)]">
        <Loader2 className="size-8 animate-spin text-[var(--atria-primary)]" />
      </div>
    );
  }

  if (error || !data?.client) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--atria-base,#F8F8F6)] p-6 text-center">
        <Shield className="size-12 text-[var(--atria-primary)]/30" />
        <h1 className="text-xl font-semibold text-[var(--atria-primary)]">
          Acesso não disponível
        </h1>
        <p className="max-w-md text-sm text-[var(--atria-primary)]/60">
          {error}
        </p>
      </div>
    );
  }

  const { accountStatus } = data;

  return (
    <PortalShell data={data}>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Contratos ativos",
            value: accountStatus.activeContracts,
            icon: CheckCircle2,
          },
          {
            label: "Aguardando aprovação",
            value: accountStatus.pendingApprovals,
            icon: Clock,
          },
          {
            label: "Posts agendados",
            value: accountStatus.scheduledPosts,
            icon: FileText,
          },
          {
            label: "Posts publicados",
            value: accountStatus.publishedPosts,
            icon: CheckCircle2,
          },
        ].map((item) => (
          <Card
            key={item.label}
            className="rounded-2xl border-[var(--atria-primary)]/10 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[var(--atria-accent)]/20 p-2 text-[var(--atria-primary)]">
                <item.icon className="size-5" />
              </div>
              <div>
                <p className="text-xs text-[var(--atria-primary)]/50">
                  {item.label}
                </p>
                <p className="text-xl font-bold text-[var(--atria-primary)]">
                  {item.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <PortalTabPills
        activeTab={activeTab}
        onChange={setActiveTab}
        counts={{
          approval: accountStatus.pendingApprovals,
          contracts: data.contracts.length,
          reports: data.recentReports.length,
        }}
      />

      {activeTab === "approval" && token && (
        <PortalApprovalHub
          token={token}
          posts={data.pendingApprovalPosts}
          scheduledPosts={data.scheduledPosts}
          onRefresh={loadPortal}
        />
      )}
      {activeTab === "contracts" && token && (
        <PortalContractsCenter
          token={token}
          contracts={data.contracts}
          onRefresh={loadPortal}
        />
      )}
      {activeTab === "reports" && token && (
        <PortalReportsViewer token={token} reports={data.recentReports} />
      )}
      {activeTab === "assets" && token && (
        <PortalAssetsDropzone
          token={token}
          recentBriefs={data.recentBriefs ?? []}
          onRefresh={loadPortal}
        />
      )}
    </PortalShell>
  );
}
