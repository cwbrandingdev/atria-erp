"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  applyAppearanceToDocument,
  DEFAULT_APPEARANCE,
  resetAppearanceToDefaults,
  type AppearanceSettings,
} from "@/lib/theme-utils";
import { applyBrandingToDocument } from "@/lib/branding-utils";
import { settingsService } from "@/services";
import { useAuth } from "@/contexts/auth-context";

interface AppearanceContextValue {
  appearance: AppearanceSettings;
  isLoading: boolean;
  loadAppearance: () => Promise<void>;
  saveAppearance: (settings: AppearanceSettings) => Promise<void>;
  setDraftAppearance: (settings: AppearanceSettings) => void;
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [appearance, setAppearance] =
    useState<AppearanceSettings>(DEFAULT_APPEARANCE);
  const [isLoading, setIsLoading] = useState(true);

  const loadAppearance = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await settingsService.getAppearance();
      setAppearance(data);
      applyAppearanceToDocument(data);
      try {
        const branding = await settingsService.getBranding();
        applyBrandingToDocument(branding);
      } catch {
        // branding already applied by BrandingProvider
      }
    } catch {
      setAppearance(DEFAULT_APPEARANCE);
      resetAppearanceToDefaults();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveAppearance = useCallback(async (settings: AppearanceSettings) => {
    const saved = await settingsService.updateAppearance(settings);
    setAppearance(saved);
    applyAppearanceToDocument(saved);
    try {
      const branding = await settingsService.getBranding();
      applyBrandingToDocument(branding);
    } catch {
      // ignore
    }
  }, []);

  const setDraftAppearance = useCallback((settings: AppearanceSettings) => {
    setAppearance(settings);
    applyAppearanceToDocument(settings);
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated) {
      void loadAppearance();
    } else {
      setAppearance(DEFAULT_APPEARANCE);
      resetAppearanceToDefaults();
      setIsLoading(false);
    }
  }, [isAuthenticated, authLoading, loadAppearance]);

  const value = useMemo(
    () => ({
      appearance,
      isLoading,
      loadAppearance,
      saveAppearance,
      setDraftAppearance,
    }),
    [appearance, isLoading, loadAppearance, saveAppearance, setDraftAppearance],
  );

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAppearance must be used within AppearanceProvider");
  }
  return context;
}
