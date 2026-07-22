"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/time-utils";
import type { ClientProfitability } from "@/services/types";

interface ProfitabilityTableProps {
  clients: ClientProfitability[];
}

export function ProfitabilityTable({ clients }: ProfitabilityTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-[var(--atria-primary)]/10 bg-white">
      <div className="border-b border-[var(--atria-primary)]/10 px-6 py-4">
        <h2 className="font-semibold text-[var(--atria-primary)]">
          Rentabilidade por Cliente
        </h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead className="text-right">Receita/mês</TableHead>
            <TableHead className="text-right">Horas</TableHead>
            <TableHead className="text-right">Custo</TableHead>
            <TableHead className="text-right">Lucro</TableHead>
            <TableHead className="text-right">Margem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Nenhum dado de rentabilidade disponível.
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => (
              <TableRow key={client.clientId}>
                <TableCell className="font-medium">
                  {client.companyName}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(client.monthlyRevenue)}
                </TableCell>
                <TableCell className="text-right">{client.totalHours}h</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(client.laborCost)}
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    client.profit >= 0 ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {formatCurrency(client.profit)}
                </TableCell>
                <TableCell className="text-right">{client.margin}%</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
