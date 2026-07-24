"use client";

import { useState } from "react";
import { ExternalLink, FileSignature, Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContractDocument } from "@/components/contracts/contract-document";
import { formatCurrency } from "@/lib/report-utils";
import { portalService } from "@/services";
import { toast } from "@/lib/toast";
import type {
  Contract,
  PortalContractDetail,
  ReportActiveProject,
} from "@/services/types";

const STATUS_LABELS: Record<string, string> = {
  draft: "Rascunho",
  sent: "Aguardando assinatura",
  signed: "Assinado",
  expired: "Expirado",
  cancelled: "Cancelado",
};

interface PortalContractsCenterProps {
  token: string;
  contracts: ReportActiveProject[];
  onRefresh: () => void;
}

export function PortalContractsCenter({
  token,
  contracts,
  onRefresh,
}: PortalContractsCenterProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [signingId, setSigningId] = useState<string | null>(null);
  const [viewContract, setViewContract] = useState<PortalContractDetail | null>(
    null,
  );

  async function openContract(contractId: string) {
    setLoadingId(contractId);
    try {
      const contract = await portalService.getPortalContract(token, contractId);
      setViewContract(contract);
    } catch {
      toast.error("Não foi possível carregar o contrato.");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleSign(contractId: string) {
    if (!confirm("Confirmar assinatura deste contrato?")) return;
    setSigningId(contractId);
    try {
      await portalService.signPortalContract(token, contractId);
      toast.success("Contrato assinado com sucesso!");
      setViewContract(null);
      onRefresh();
    } catch {
      toast.error("Não foi possível assinar o contrato.");
    } finally {
      setSigningId(null);
    }
  }

  function handlePrint() {
    window.print();
  }

  const contractForDocument: Contract | null = viewContract
    ? {
        ...viewContract,
        receivablesCount: 0,
      }
    : null;

  return (
    <>
      <div className="flex flex-col gap-4">
        {contracts.length === 0 ? (
          <Card className="rounded-2xl border-[var(--atria-primary)]/10 bg-white p-8 text-center text-sm text-[var(--atria-primary)]/50">
            Nenhum contrato disponível.
          </Card>
        ) : (
          contracts.map((contract) => (
            <Card
              key={contract.id}
              className="flex flex-col gap-4 rounded-2xl border-[var(--atria-primary)]/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[var(--atria-accent)]/20 p-2.5">
                  <FileSignature className="size-5 text-[var(--atria-primary)]" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--atria-primary)]">
                    {contract.title}
                  </p>
                  <p className="mt-1 text-sm text-[var(--atria-primary)]/60">
                    {formatCurrency(contract.recurringValue)} ·{" "}
                    {contract.paymentFrequency === "monthly"
                      ? "Mensal"
                      : "Único"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--atria-primary)]/40">
                    {new Date(contract.startDate).toLocaleDateString("pt-BR")}
                    {contract.endDate
                      ? ` – ${new Date(contract.endDate).toLocaleDateString("pt-BR")}`
                      : ""}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    contract.status === "signed"
                      ? "bg-green-100 text-green-700"
                      : contract.status === "sent"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {STATUS_LABELS[contract.status] ?? contract.status}
                </span>
                {contract.pdfUrl && (
                  <a
                    href={contract.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-[var(--atria-primary)] hover:underline"
                  >
                    PDF <ExternalLink className="size-3" />
                  </a>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={loadingId === contract.id}
                  onClick={() => void openContract(contract.id)}
                >
                  {loadingId === contract.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Ver & imprimir"
                  )}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog
        open={!!viewContract}
        onOpenChange={(open) => !open && setViewContract(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0">
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle className="flex items-center justify-between gap-4">
              <span>{viewContract?.title}</span>
              <div className="flex gap-2 print:hidden">
                <Button size="sm" variant="outline" onClick={handlePrint}>
                  <Printer className="size-4" />
                  Imprimir
                </Button>
                {viewContract &&
                  (viewContract.status === "sent" ||
                    viewContract.status === "draft") && (
                    <Button
                      size="sm"
                      disabled={signingId === viewContract.id}
                      onClick={() => void handleSign(viewContract.id)}
                    >
                      {signingId === viewContract.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "Assinar contrato"
                      )}
                    </Button>
                  )}
              </div>
            </DialogTitle>
          </DialogHeader>
          {contractForDocument && (
            <div className="p-6">
              <ContractDocument contract={contractForDocument} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
