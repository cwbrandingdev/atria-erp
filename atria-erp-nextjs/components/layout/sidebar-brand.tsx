"use client";

import { AgencyLogo } from "@/components/branding/agency-logo";

export function SidebarBrand() {
  return (
    <div className="flex items-start justify-between gap-2">
      <AgencyLogo
        size="md"
        variant="sidebar"
        subtitle="Workspace da agência"
        showName
        className="min-w-0 flex-1"
      />
      <span className="shrink-0 rounded-md bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[var(--atria-accent)] ring-1 ring-white/10">
        PROD
      </span>
    </div>
  );
}
