"use client";

import { useCallback, useEffect, useState } from "react";
import { ClientCard } from "@/components/clients/client-card";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
import { clientsService } from "@/services";
import type { Client } from "@/services/types";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clientsService.getClients();
      setClients(data);
    } catch {
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadClients();
  }, [loadClients]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--atria-primary)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--atria-primary)]">
            Clientes
          </h1>
          <p className="text-sm text-[var(--atria-primary)]/50">
            Gerencie clientes e conecte com a criação de conteúdo
          </p>
        </div>
        <ClientFormDialog onSuccess={() => void loadClients()} />
      </div>

      {clients.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--atria-primary)]/20 p-12 text-center">
          <p className="text-sm text-[var(--atria-primary)]/50">
            Nenhum cliente cadastrado. Adicione o primeiro cliente para começar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onUpdate={() => void loadClients()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
