"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  buildContractPdfFilename,
  formatCurrency,
  formatDate,
  FREQUENCY_LABELS,
  STATUS_LABELS,
  STATUS_STYLES,
} from "@/lib/contract-utils";
import { toast } from "@/lib/toast";
import { contractsService } from "@/services";
import type { Contract } from "@/services/types";

interface ContractPdfViewerDialogProps {
  contract: Contract | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContractPdfViewerDialog({
  contract,
  open,
  onOpenChange,
}: ContractPdfViewerDialogProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !contract) {
      return;
    }

    let active = true;
    let objectUrl: string | null = null;

    async function loadPdf() {
      setLoading(true);
      setError(null);
      setPdfUrl(null);

      try {
        const blob = await contractsService.getContractPdf(contract!.id);
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch {
        if (!active) return;
        setError("Não foi possível carregar o PDF do contrato.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadPdf();

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      setPdfUrl(null);
    };
  }, [open, contract?.id]);

  function handlePrint() {
    const frame = iframeRef.current;
    if (!frame?.contentWindow) {
      toast.error("Aguarde o PDF carregar para imprimir.");
      return;
    }

    frame.contentWindow.focus();
    frame.contentWindow.print();
  }

  function handleDownload() {
    if (!pdfUrl || !contract) {
      toast.error("Aguarde o PDF carregar para baixar.");
      return;
    }

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = buildContractPdfFilename(contract);
    link.click();
  }

  if (!contract) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <DialogHeader className="border-b border-[var(--atria-primary)]/10 px-6 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle className="text-[var(--atria-primary)]">
              {contract.title}
            </DialogTitle>
            <Badge className={STATUS_STYLES[contract.status]}>
              {STATUS_LABELS[contract.status]}
            </Badge>
          </div>
          <p className="text-sm text-[var(--atria-primary)]/60">
            {contract.client.companyName} ·{" "}
            {formatCurrency(contract.recurringValue)} ·{" "}
            {FREQUENCY_LABELS[contract.paymentFrequency]} · Início{" "}
            {formatDate(contract.startDate)}
          </p>
        </DialogHeader>

        <div className="relative min-h-[65vh] flex-1 bg-[#f1f5f5]">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 text-[var(--atria-primary)]">
                <Loader2 className="size-8 animate-spin" />
                <p className="text-sm">Gerando visualização do PDF...</p>
              </div>
            </div>
          )}

          {error ? (
            <div className="flex h-full items-center justify-center p-8">
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            </div>
          ) : pdfUrl ? (
            <iframe
              ref={iframeRef}
              src={pdfUrl}
              title={`PDF - ${contract.title}`}
              className="h-[65vh] w-full border-0 bg-white"
            />
          ) : null}
        </div>

        <DialogFooter className="border-t border-[var(--atria-primary)]/10 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={handlePrint}
            disabled={loading || !pdfUrl}
          >
            <Printer className="size-4" />
            Imprimir
          </Button>
          <Button
            type="button"
            className="gap-2 bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90"
            onClick={handleDownload}
            disabled={loading || !pdfUrl}
          >
            <Download className="size-4" />
            Baixar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
