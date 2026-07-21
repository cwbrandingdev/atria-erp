"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Receipt,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const metrics = [
  {
    label: "Receita total",
    value: "R$ 62.400",
    change: "+12%",
    positive: true,
    icon: ArrowUpRight,
  },
  {
    label: "Despesas",
    value: "R$ 14.200",
    change: "-3%",
    positive: true,
    icon: ArrowDownRight,
  },
  {
    label: "Saldo",
    value: "R$ 48.200",
    change: "+18%",
    positive: true,
    icon: Wallet,
  },
  {
    label: "Faturas pendentes",
    value: "R$ 8.500",
    change: "3 faturas",
    positive: false,
    icon: Receipt,
  },
];

const transactions = [
  {
    id: "1",
    description: "Projeto Branding — Cliente A",
    amount: 12500,
    type: "income" as const,
    date: "20 Jul",
    category: "Projetos",
  },
  {
    id: "2",
    description: "Assinatura Adobe Creative Cloud",
    amount: -890,
    type: "expense" as const,
    date: "18 Jul",
    category: "Ferramentas",
  },
  {
    id: "3",
    description: "Campanha Social Media — Cliente B",
    amount: 8200,
    type: "income" as const,
    date: "15 Jul",
    category: "Projetos",
  },
  {
    id: "4",
    description: "Freelancer — Edição de vídeo",
    amount: -2400,
    type: "expense" as const,
    date: "12 Jul",
    category: "Equipe",
  },
  {
    id: "5",
    description: "Retainer Mensal — Cliente C",
    amount: 15000,
    type: "income" as const,
    date: "01 Jul",
    category: "Retainer",
  },
];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function FinanceDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#013C3C]">
          Dashboard Financeiro
        </h1>
        <p className="text-sm text-[#013C3C]/50">
          Visão geral de receitas, despesas e fluxo de caixa
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card
              key={metric.label}
              className="rounded-2xl border border-[#013C3C]/10 bg-white p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-xl bg-[#E8C39E]/30 p-2 text-[#013C3C]">
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={`text-xs font-medium ${
                    metric.positive ? "text-green-600" : "text-[#013C3C]/50"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
              <p className="text-xl font-bold text-[#013C3C]">{metric.value}</p>
              <p className="text-xs text-[#013C3C]/50">{metric.label}</p>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-2xl border border-[#013C3C]/10 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-[#013C3C]" />
          <h2 className="font-semibold text-[#013C3C]">
            Transações recentes
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#013C3C]/50">Descrição</TableHead>
              <TableHead className="text-[#013C3C]/50">Categoria</TableHead>
              <TableHead className="text-[#013C3C]/50">Data</TableHead>
              <TableHead className="text-right text-[#013C3C]/50">
                Valor
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-medium text-[#013C3C]">
                  {tx.description}
                </TableCell>
                <TableCell className="text-[#013C3C]/60">
                  {tx.category}
                </TableCell>
                <TableCell className="text-[#013C3C]/60">{tx.date}</TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    tx.type === "income" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {formatCurrency(Math.abs(tx.amount))}
                  {tx.type === "expense" ? " −" : ""}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
