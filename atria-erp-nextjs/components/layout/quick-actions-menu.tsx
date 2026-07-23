"use client";

import Link from "next/link";
import {
  ChevronDown,
  FileText,
  Kanban,
  Plus,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ACTIONS = [
  {
    label: "Nova Tarefa",
    href: "/kanban",
    icon: Kanban,
    description: "Adicionar ao quadro Kanban",
  },
  {
    label: "Novo Cliente",
    href: "/clients",
    icon: Users,
    description: "Cadastrar cliente",
  },
  {
    label: "Nova Transação",
    href: "/financial",
    icon: Wallet,
    description: "Registrar receita ou despesa",
  },
  {
    label: "Novo Conteúdo",
    href: "/content?create=1",
    icon: FileText,
    description: "Criar post ou conteúdo",
  },
] as const;

export function QuickActionsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button className="h-9 gap-1.5 bg-[var(--atria-primary)] px-3 text-white shadow-sm hover:bg-[var(--atria-primary)]/90" />
        }
      >
        <Plus className="size-4" />
        <span className="hidden sm:inline">Novo</span>
        <ChevronDown className="size-3.5 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Criar novo</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ACTIONS.map((action) => (
          <DropdownMenuItem
            key={action.href}
            render={<Link href={action.href} />}
            className="flex flex-col items-start gap-0.5 py-2.5"
          >
            <div className="flex items-center gap-2">
              <action.icon className="size-4 text-[var(--atria-primary)]" />
              <span className="font-medium">{action.label}</span>
            </div>
            <span className="pl-6 text-xs text-muted-foreground">
              {action.description}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
