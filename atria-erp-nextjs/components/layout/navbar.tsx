"use client";

import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActiveTimerBadge } from "@/components/layout/active-timer-badge";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import {
  CommandPalette,
  useCommandPalette,
} from "@/components/layout/command-palette";
import { NotificationCenter } from "@/components/layout/notification-center";
import { QuickActionsMenu } from "@/components/layout/quick-actions-menu";

interface AppNavbarProps {
  onMenuClick: () => void;
}

export function AppNavbar({ onMenuClick }: AppNavbarProps) {
  const { open, setOpen } = useCommandPalette();

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-[var(--atria-primary)]/8 bg-[var(--atria-base)]/80 px-4 backdrop-blur-md lg:h-16 lg:gap-4 lg:px-6">
        {/* Left */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 lg:hidden"
            onClick={onMenuClick}
            aria-label="Abrir menu"
          >
            <Menu className="size-5 text-[var(--atria-primary)]" />
          </Button>

          <div className="hidden min-w-0 lg:block">
            <BreadcrumbNav />
          </div>

          <div className="min-w-0 lg:hidden">
            <span className="text-sm font-bold text-[var(--atria-primary)]">ATRIA</span>
          </div>
        </div>

        {/* Center — search trigger */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="hidden max-w-md flex-1 items-center gap-2 rounded-lg border border-[var(--atria-primary)]/10 bg-white px-3 py-2 text-left text-sm text-[var(--atria-primary)]/40 shadow-sm transition-all hover:border-[var(--atria-primary)]/20 hover:bg-[var(--atria-primary)]/[0.02] md:flex"
        >
          <Search className="size-4 shrink-0" />
          <span className="flex-1 truncate">Buscar em todo o sistema...</span>
          <kbd className="hidden rounded border border-[var(--atria-primary)]/10 bg-[var(--atria-primary)]/5 px-1.5 py-0.5 text-[10px] font-medium text-[var(--atria-primary)]/50 lg:inline">
            ⌘K
          </kbd>
        </button>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Buscar"
          >
            <Search className="size-4 text-[var(--atria-primary)]" />
          </Button>

          <ActiveTimerBadge />
          <QuickActionsMenu />
          <NotificationCenter />
        </div>
      </header>

      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  );
}
