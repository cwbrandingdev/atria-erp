"use client";

import { cn } from "@/lib/utils";

export type PortalTab =
  | "approval"
  | "contracts"
  | "reports"
  | "assets";

const TABS: Array<{ id: PortalTab; label: string }> = [
  { id: "approval", label: "Aprovações" },
  { id: "contracts", label: "Contratos" },
  { id: "reports", label: "Relatórios" },
  { id: "assets", label: "Assets & Briefings" },
];

interface PortalTabPillsProps {
  activeTab: PortalTab;
  onChange: (tab: PortalTab) => void;
  counts?: Partial<Record<PortalTab, number>>;
}

export function PortalTabPills({
  activeTab,
  onChange,
  counts,
}: PortalTabPillsProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-1.5 shadow-sm">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
            activeTab === tab.id
              ? "bg-[var(--atria-primary)] text-white shadow-sm"
              : "text-[var(--atria-primary)]/70 hover:bg-[var(--atria-primary)]/5 hover:text-[var(--atria-primary)]",
          )}
        >
          {tab.label}
          {counts?.[tab.id] ? (
            <span
              className={cn(
                "ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-[var(--atria-accent)]/40 text-[var(--atria-primary)]",
              )}
            >
              {counts[tab.id]}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
