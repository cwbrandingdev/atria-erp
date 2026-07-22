"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/layout/notification-center";

interface AppTopbarProps {
  onMenuClick: () => void;
}

export function AppTopbar({ onMenuClick }: AppTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-[var(--atria-base)] px-4 shadow-sm lg:px-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <Menu className="size-5 text-[var(--atria-primary)]" />
        </Button>

        <div className="lg:hidden">
          <h1 className="text-lg font-bold text-[var(--atria-primary)]">ATRIA</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p className="hidden text-sm text-[var(--atria-primary)]/50 lg:block">
          Painel Administrativo
        </p>
        <NotificationCenter />
      </div>
    </header>
  );
}
