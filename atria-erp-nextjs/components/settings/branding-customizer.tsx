"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, Loader2, Save, Sparkles } from "lucide-react";
import { AgencyLogo } from "@/components/branding/agency-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useBranding } from "@/contexts/branding-context";
import {
  DEFAULT_BRANDING,
  resolveBrandingAssetUrl,
  type AgencyBranding,
} from "@/lib/branding-utils";
import { ACCENT_PRESETS, PRIMARY_PRESETS } from "@/lib/theme-utils";
import { toast } from "@/lib/toast";

function ColorPicker({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-9 w-12 cursor-pointer rounded-lg border border-input"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-8 flex-1 rounded-lg border border-input bg-transparent px-2.5 font-mono text-sm uppercase"
          maxLength={7}
        />
      </div>
    </Field>
  );
}

function AssetUploadField({
  label,
  previewUrl,
  onUpload,
  uploading,
}: {
  label: string;
  previewUrl: string | null;
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-4">
        <div className="flex size-16 items-center justify-center overflow-hidden rounded-xl border border-dashed border-[var(--atria-primary)]/20 bg-[var(--atria-primary)]/5">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={label}
              width={64}
              height={64}
              className="size-full object-contain p-1"
              unoptimized
            />
          ) : (
            <ImageIcon className="size-6 text-[var(--atria-primary)]/30" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onUpload(file);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <ImageIcon className="mr-2 size-4" />
            )}
            Enviar imagem
          </Button>
          <p className="text-[11px] text-[var(--atria-primary)]/45">
            PNG, JPG, WEBP, SVG ou ICO · máx. 5MB
          </p>
        </div>
      </div>
    </Field>
  );
}

export function BrandingCustomizer() {
  const { branding, isLoading, saveBranding, uploadBrandingAsset } =
    useBranding();
  const [draft, setDraft] = useState<AgencyBranding>(branding);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  useEffect(() => {
    if (!isLoading) setDraft(branding);
  }, [branding, isLoading]);

  function updateDraft(partial: Partial<AgencyBranding>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveBranding(draft);
      toast.success("Identidade visual salva com sucesso!");
    } catch {
      toast.error("Não foi possível salvar a identidade visual.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setDraft(DEFAULT_BRANDING);
  }

  async function handleLogoUpload(file: File) {
    setUploadingLogo(true);
    try {
      const saved = await uploadBrandingAsset("logo", file);
      setDraft(saved);
      toast.success("Logo atualizado!");
    } catch {
      toast.error("Não foi possível enviar o logo.");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleFaviconUpload(file: File) {
    setUploadingFavicon(true);
    try {
      const saved = await uploadBrandingAsset("favicon", file);
      setDraft(saved);
      toast.success("Favicon atualizado!");
    } catch {
      toast.error("Não foi possível enviar o favicon.");
    } finally {
      setUploadingFavicon(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-[var(--atria-accent)]/20 p-2 text-[var(--atria-primary)]">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--atria-primary)]">
              Identidade da Agência
            </h2>
            <p className="text-xs text-[var(--atria-primary)]/50">
              Logo, cores e nome exibidos em todo o ERP
            </p>
          </div>
        </div>

        <FieldGroup className="gap-5">
          <Field>
            <FieldLabel htmlFor="agency-name">Nome da Agência</FieldLabel>
            <Input
              id="agency-name"
              value={draft.agencyName}
              onChange={(e) => updateDraft({ agencyName: e.target.value })}
              placeholder="Ex: Estúdio Aurora"
            />
          </Field>

          <AssetUploadField
            label="Logo"
            previewUrl={resolveBrandingAssetUrl(draft.logoUrl)}
            onUpload={handleLogoUpload}
            uploading={uploadingLogo}
          />

          <AssetUploadField
            label="Favicon"
            previewUrl={resolveBrandingAssetUrl(draft.faviconUrl)}
            onUpload={handleFaviconUpload}
            uploading={uploadingFavicon}
          />

          <ColorPicker
            id="brand-primary"
            label="Cor Primária"
            value={draft.primaryColor}
            onChange={(v) => updateDraft({ primaryColor: v })}
          />

          <div className="flex flex-wrap gap-2">
            {PRIMARY_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => updateDraft({ primaryColor: preset.value })}
                className="flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs"
              >
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: preset.value }}
                />
                {preset.name}
              </button>
            ))}
          </div>

          <ColorPicker
            id="brand-accent"
            label="Cor de Destaque"
            value={draft.accentColor}
            onChange={(v) => updateDraft({ accentColor: v })}
          />

          <div className="flex flex-wrap gap-2">
            {ACCENT_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => updateDraft({ accentColor: preset.value })}
                className="flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs"
              >
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: preset.value }}
                />
                {preset.name}
              </button>
            ))}
          </div>
        </FieldGroup>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            onClick={() => void handleSave()}
            disabled={saving}
            className="bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90"
          >
            {saving ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Save className="mr-2 size-4" />
            )}
            Salvar Identidade
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Restaurar padrão
          </Button>
        </div>
      </Card>

      <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6">
        <h3 className="mb-4 font-semibold text-[var(--atria-primary)]">
          Pré-visualização
        </h3>

        <div
          className="mb-6 rounded-2xl p-5 text-white"
          style={{ backgroundColor: draft.primaryColor }}
        >
          <AgencyLogo
            size="md"
            variant="sidebar"
            subtitle="Workspace da agência"
            showName
          />
        </div>

        <div className="rounded-2xl border border-[var(--atria-primary)]/10 bg-[#f7fafa] p-5">
          <AgencyLogo
            size="lg"
            variant="login"
            subtitle="Workspace inteligente"
            showName
          />
        </div>
      </Card>
    </div>
  );
}
