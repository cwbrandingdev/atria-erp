"use client";

import type { ReactNode } from "react";
import { AgencyLogo } from "@/components/branding/agency-logo";
import { useBranding } from "@/contexts/branding-context";
import type { PortalData } from "@/services/types";

interface PortalShellProps {
  data: PortalData;
  children: ReactNode;
}

export function PortalShell({ data, children }: PortalShellProps) {
  const { branding } = useBranding();
  const { client, accountStatus } = data;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--atria-base, #F8F8F6)",
        color: "var(--atria-text, #0F172A)",
      }}
    >
      <header
        className="px-6 py-8 text-white shadow-lg"
        style={{ backgroundColor: branding.primaryColor }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <AgencyLogo
            size="md"
            variant="sidebar"
            subtitle="Portal do Cliente"
            showName
          />
          <div className="text-left sm:text-right">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: branding.accentColor }}
            >
              {accountStatus.status === "active" ? "Conta ativa" : "Onboarding"}
            </p>
            <h1 className="mt-1 text-2xl font-bold">{client?.companyName}</h1>
            {client?.contactName && (
              <p className="mt-1 text-sm text-white/75">{client.contactName}</p>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>

      <footer
        className="border-t py-6 text-center text-xs"
        style={{
          borderColor: `${branding.primaryColor}15`,
          color: `${branding.primaryColor}80`,
        }}
      >
        {branding.agencyName} · Portal do Cliente · Acesso seguro por link
        exclusivo
      </footer>
    </div>
  );
}
