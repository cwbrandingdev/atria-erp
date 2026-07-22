"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { clientsService, contractsService, ApiError } from "@/services";
import type {
  Client,
  Contract,
  ContractStatus,
  CreateContractInput,
  PaymentFrequency,
} from "@/services/types";

const DEFAULT_TERMS = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

1. OBJETO
Prestação de serviços de marketing digital conforme escopo acordado entre as partes.

2. VALOR E PAGAMENTO
O valor e a periodicidade de pagamento estão definidos neste contrato.

3. VIGÊNCIA
O contrato entra em vigor na data de início e permanece válido até a data de término, quando aplicável.

4. CONFIDENCIALIDADE
As partes comprometem-se a manter sigilo sobre informações estratégicas compartilhadas.`;

interface ContractFormDialogProps {
  contract?: Contract | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess: () => void;
  trigger?: boolean;
}

export function ContractFormDialog({
  contract,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
  trigger = true,
}: ContractFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  const [clientId, setClientId] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<ContractStatus>("draft");
  const [recurringValue, setRecurringValue] = useState("");
  const [paymentFrequency, setPaymentFrequency] =
    useState<PaymentFrequency>("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [termsContent, setTermsContent] = useState(DEFAULT_TERMS);
  const [pdfUrl, setPdfUrl] = useState("");

  const isEditing = Boolean(contract);

  useEffect(() => {
    if (open) {
      clientsService.getClients().then(setClients).catch(() => setClients([]));
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (contract) {
      setClientId(contract.clientId);
      setTitle(contract.title);
      setStatus(contract.status);
      setRecurringValue(String(contract.recurringValue));
      setPaymentFrequency(contract.paymentFrequency);
      setStartDate(contract.startDate.split("T")[0]);
      setEndDate(contract.endDate ? contract.endDate.split("T")[0] : "");
      setTermsContent(contract.termsContent);
      setPdfUrl(contract.pdfUrl ?? "");
    } else {
      setClientId("");
      setTitle("");
      setStatus("draft");
      setRecurringValue("");
      setPaymentFrequency("monthly");
      setStartDate(new Date().toISOString().split("T")[0]);
      setEndDate("");
      setTermsContent(DEFAULT_TERMS);
      setPdfUrl("");
    }
    setError(null);
  }, [contract, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: CreateContractInput = {
      clientId,
      title,
      status,
      recurringValue: parseFloat(recurringValue),
      paymentFrequency,
      startDate: new Date(startDate).toISOString(),
      endDate:
        paymentFrequency === "monthly" && endDate
          ? new Date(endDate).toISOString()
          : undefined,
      termsContent,
      pdfUrl: pdfUrl || undefined,
    };

    try {
      if (isEditing && contract) {
        await contractsService.updateContract(contract.id, payload);
      } else {
        await contractsService.createContract(payload);
      }

      setOpen(false);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível salvar o contrato.",
      );
    } finally {
      setLoading(false);
    }
  }

  const dialogContent = (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle className="text-[var(--atria-primary)]">
            {isEditing ? "Editar Contrato" : "Novo Contrato"}
          </DialogTitle>
        </DialogHeader>

        <FieldGroup className="py-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <Field>
            <FieldLabel htmlFor="contract-client">Cliente *</FieldLabel>
            <select
              id="contract-client"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              required
              disabled={isEditing && contract?.status === "signed"}
            >
              <option value="">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.companyName}
                </option>
              ))}
            </select>
          </Field>

          <Field>
            <FieldLabel htmlFor="contract-title">Título *</FieldLabel>
            <Input
              id="contract-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="contract-value">Valor (R$) *</FieldLabel>
              <Input
                id="contract-value"
                type="number"
                min="0.01"
                step="0.01"
                value={recurringValue}
                onChange={(e) => setRecurringValue(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="contract-frequency">Frequência *</FieldLabel>
              <select
                id="contract-frequency"
                value={paymentFrequency}
                onChange={(e) =>
                  setPaymentFrequency(e.target.value as PaymentFrequency)
                }
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                <option value="monthly">Mensal</option>
                <option value="one_time">Único</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="contract-start">Início *</FieldLabel>
              <Input
                id="contract-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Field>

            {paymentFrequency === "monthly" && (
              <Field>
                <FieldLabel htmlFor="contract-end">Término</FieldLabel>
                <Input
                  id="contract-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Field>
            )}
          </div>

          {!isEditing && (
            <Field>
              <FieldLabel htmlFor="contract-status">Status inicial</FieldLabel>
              <select
                id="contract-status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as ContractStatus)
                }
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                <option value="draft">Rascunho</option>
                <option value="sent">Enviado</option>
              </select>
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor="contract-terms">Termos do Contrato *</FieldLabel>
            <textarea
              id="contract-terms"
              value={termsContent}
              onChange={(e) => setTermsContent(e.target.value)}
              rows={10}
              required
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 font-mono text-sm"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="contract-pdf">URL do PDF (opcional)</FieldLabel>
            <Input
              id="contract-pdf"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="https://..."
            />
          </Field>
        </FieldGroup>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || !clientId}
            className="bg-[var(--atria-primary)] text-white"
          >
            {loading ? "Salvando..." : isEditing ? "Atualizar" : "Criar Contrato"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );

  if (!trigger) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90" />
        }
      >
        <Plus className="size-4" />
        Novo Contrato
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
