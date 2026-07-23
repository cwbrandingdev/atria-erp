import { apiRequest } from "./api";
import type { AppearanceSettings } from "@/lib/theme-utils";

export async function getAppearance() {
  return apiRequest<AppearanceSettings>("/settings/appearance");
}

export async function updateAppearance(data: AppearanceSettings) {
  return apiRequest<AppearanceSettings>("/settings/appearance", {
    method: "PATCH",
    body: {
      primaryColor: data.primaryColor,
      accentColor: data.accentColor,
      backgroundColor: data.backgroundColor,
      textColor: data.textColor,
    },
  });
}
