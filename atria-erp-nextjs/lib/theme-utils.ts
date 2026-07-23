export interface AppearanceSettings {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  updatedAt?: string;
}

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  primaryColor: "#004949",
  accentColor: "#E8C39E",
  backgroundColor: "#FFFFFF",
  textColor: "#0F172A",
};

export const PRIMARY_PRESETS = [
  { name: "Atria Emerald", value: "#004949" },
  { name: "Corporate Navy", value: "#1E3A8A" },
  { name: "Deep Purple", value: "#581C87" },
  { name: "Midnight Slate", value: "#0F172A" },
] as const;

export const ACCENT_PRESETS = [
  { name: "Atria Sand", value: "#E8C39E" },
  { name: "Coral Gold", value: "#F59E0B" },
  { name: "Crimson Accent", value: "#EF4444" },
  { name: "Teal Accent", value: "#14B8A6" },
] as const;

export const BACKGROUND_PRESETS = [
  { name: "Pure White", value: "#FFFFFF" },
  { name: "Soft Light Gray", value: "#F8FAFC" },
  { name: "Dark Mode Slate", value: "#0F172A" },
] as const;

export const TEXT_PRESETS = [
  { name: "Dark Charcoal", value: "#0F172A" },
  { name: "Medium Gray", value: "#334155" },
  { name: "Soft White", value: "#F8FAFC" },
] as const;

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getContrastColor(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#0F172A" : "#F8FAFC";
}

export function applyAppearanceToDocument(settings: AppearanceSettings) {
  const root = document.documentElement;
  root.style.setProperty("--atria-primary", settings.primaryColor);
  root.style.setProperty("--atria-accent", settings.accentColor);
  root.style.setProperty("--atria-base", settings.backgroundColor);
  root.style.setProperty("--atria-text", settings.textColor);

  root.style.setProperty("--background", settings.backgroundColor);
  root.style.setProperty("--foreground", settings.textColor);
  root.style.setProperty("--card", settings.backgroundColor);
  root.style.setProperty("--card-foreground", settings.textColor);
  root.style.setProperty("--primary", settings.primaryColor);
  root.style.setProperty(
    "--primary-foreground",
    getContrastColor(settings.primaryColor),
  );
  root.style.setProperty("--accent", settings.accentColor);
  root.style.setProperty(
    "--accent-foreground",
    getContrastColor(settings.accentColor),
  );
  root.style.setProperty("--sidebar", settings.primaryColor);
  root.style.setProperty(
    "--sidebar-foreground",
    getContrastColor(settings.primaryColor),
  );
  root.style.setProperty("--sidebar-primary", settings.accentColor);
  root.style.setProperty(
    "--sidebar-primary-foreground",
    getContrastColor(settings.accentColor),
  );
}

export function resetAppearanceToDefaults() {
  applyAppearanceToDocument(DEFAULT_APPEARANCE);
}
