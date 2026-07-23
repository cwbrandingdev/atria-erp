"use client";

import { AppearanceCustomizer } from "@/components/settings/appearance-customizer";
import { SettingsNav } from "@/components/settings/settings-nav";

export default function SettingsAppearancePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--atria-primary)]">
          Configurações
        </h1>
        <p className="text-sm text-[var(--atria-primary)]/50">
          Personalize a aparência do sistema — cores aplicadas globalmente
        </p>
      </div>
      <SettingsNav />
      <AppearanceCustomizer />
    </div>
  );
}
