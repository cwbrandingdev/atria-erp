"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarPlus,
  FileText,
  FolderUp,
  Kanban,
  Sparkles,
} from "lucide-react";
import { BriefToContentModal } from "@/components/creation/brief-to-content-modal";
import { Button } from "@/components/ui/button";

const LINK_ACTIONS = [
  {
    label: "Novo Post",
    href: "/content?create=1",
    icon: FileText,
    color: "bg-[var(--atria-primary)] hover:bg-[var(--atria-primary)]/90",
  },
  {
    label: "Nova Tarefa",
    href: "/kanban",
    icon: Kanban,
    color: "bg-[#2563EB] hover:bg-[#1D4ED8]",
  },
  {
    label: "Agendar Evento",
    href: "/calendar",
    icon: CalendarPlus,
    color: "bg-[#7C3AED] hover:bg-[#6D28D9]",
  },
  {
    label: "Enviar Asset",
    href: "/assets",
    icon: FolderUp,
    color: "bg-[#D97706] hover:bg-[#B45309]",
  },
] as const;

interface CreationQuickActionBarProps {
  onBriefSuccess?: () => void;
}

export function CreationQuickActionBar({
  onBriefSuccess,
}: CreationQuickActionBarProps) {
  const [briefOpen, setBriefOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <Button
          size="icon"
          title="Brief com IA"
          onClick={() => setBriefOpen(true)}
          className="size-14 rounded-full bg-gradient-to-br from-[var(--atria-primary)] to-[#7C3AED] text-white shadow-lg transition-all duration-200 hover:opacity-90"
        >
          <Sparkles className="size-6" />
        </Button>

        {LINK_ACTIONS.map((action, index) => (
          <Button
            key={action.href}
            size="icon"
            title={action.label}
            className={`rounded-full text-white shadow-lg transition-all duration-200 ${action.color} ${
              index === 0 ? "size-14" : "size-11 opacity-95"
            }`}
            render={<Link href={action.href} aria-label={action.label} />}
          >
            <action.icon className={index === 0 ? "size-6" : "size-5"} />
          </Button>
        ))}
      </div>

      <BriefToContentModal
        open={briefOpen}
        onOpenChange={setBriefOpen}
        onSuccess={onBriefSuccess}
      />
    </>
  );
}
