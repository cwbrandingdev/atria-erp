"use client";

import { BrandingCustomizer } from "@/components/settings/branding-customizer";
import { SettingsNav } from "@/components/settings/settings-nav";

export default function SettingsBrandingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--atria-primary)]">
          Identidade Visual
        </h1>
        <p className="text-sm text-[var(--atria-primary)]/50">
          Personalize logo, cores e nome da agência em todo o sistema
        </p>
      </div>
      <SettingsNav />
      <BrandingCustomizer />
    </div>
  );
}
