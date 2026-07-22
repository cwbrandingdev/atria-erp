"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUserProfile } from "./sidebar-user-profile";

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileDrawer({ open, onOpenChange }: MobileDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="flex w-72 flex-col border-none bg-[var(--atria-primary)] p-0 text-white"
        showCloseButton
      >
        <SheetHeader className="shrink-0 border-b border-white/10 px-6 py-6">
          <SheetTitle className="text-left text-white">
            <span className="text-2xl font-bold tracking-tight">ATRIA</span>
            <span className="mt-1 block text-xs font-medium text-[var(--atria-accent)]">
              Admin Panel
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <SidebarNav onNavigate={() => onOpenChange(false)} />
        </div>

        <SidebarUserProfile
          onAction={() => onOpenChange(false)}
          className="shrink-0"
        />
      </SheetContent>
    </Sheet>
  );
}
