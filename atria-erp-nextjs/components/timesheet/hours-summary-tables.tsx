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
import type { ClientHours, TeamMemberHours } from "@/services/types";

interface HoursSummaryTablesProps {
  byMember: TeamMemberHours[];
  byClient: ClientHours[];
}

export function HoursSummaryTables({
  byMember,
  byClient,
}: HoursSummaryTablesProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="overflow-hidden rounded-2xl border border-[var(--atria-primary)]/10 bg-white">
        <div className="border-b border-[var(--atria-primary)]/10 px-6 py-4">
          <h2 className="font-semibold text-[var(--atria-primary)]">
            Horas por Membro da Equipe
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membro</TableHead>
              <TableHead className="text-right">Horas</TableHead>
              <TableHead className="text-right">Registros</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {byMember.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Nenhum registro de tempo.
                </TableCell>
              </TableRow>
            ) : (
              byMember.map((member) => (
                <TableRow key={member.userId}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-right">{member.totalHours}h</TableCell>
                  <TableCell className="text-right">{member.logCount}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Card className="overflow-hidden rounded-2xl border border-[var(--atria-primary)]/10 bg-white">
        <div className="border-b border-[var(--atria-primary)]/10 px-6 py-4">
          <h2 className="font-semibold text-[var(--atria-primary)]">
            Horas por Cliente
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Horas</TableHead>
              <TableHead className="text-right">Registros</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {byClient.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Nenhum registro vinculado a clientes.
                </TableCell>
              </TableRow>
            ) : (
              byClient.map((client) => (
                <TableRow key={client.clientId}>
                  <TableCell className="font-medium">
                    {client.companyName}
                  </TableCell>
                  <TableCell className="text-right">{client.totalHours}h</TableCell>
                  <TableCell className="text-right">{client.logCount}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
