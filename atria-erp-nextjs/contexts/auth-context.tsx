"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  clearAuthStorage,
  getAccessToken,
  getStoredUser,
  setAccessToken,
  setStoredUser,
} from "@/lib/auth-storage";
import { apiRequest } from "@/services/api";
import { toast } from "@/lib/toast";
import type { AuthResponse, LoginCredentials, User } from "@/services/types";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((response: AuthResponse, remember = false) => {
    setAccessToken(response.accessToken, remember);
    setStoredUser(response.user, remember);
    setToken(response.accessToken);
    setUser(response.user);
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const response = await apiRequest<AuthResponse>("/auth/refresh", {
        method: "POST",
        body: {},
        skipAuth: true,
      });
      applySession(response);
      return true;
    } catch {
      clearAuthStorage();
      setToken(null);
      setUser(null);
      return false;
    }
  }, [applySession]);

  useEffect(() => {
    async function init() {
      const storedToken = getAccessToken();
      const storedUser = getStoredUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        setIsLoading(false);
        return;
      }

      const refreshed = await refreshSession();
      if (!refreshed) {
        clearAuthStorage();
      }
      setIsLoading(false);
    }

    void init();
  }, [refreshSession]);

  const login = useCallback(
    async (credentials: LoginCredentials, rememberMe = false) => {
      const response = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: credentials,
        skipAuth: true,
      });
      applySession(response, rememberMe);
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await apiRequest<void>("/auth/logout", { method: "POST" });
    } finally {
      clearAuthStorage();
      setToken(null);
      setUser(null);
      toast.success("Sessão encerrada com sucesso");
      router.push("/login");
    }
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken && user),
      isLoading,
      login,
      logout,
      refreshSession,
    }),
    [user, accessToken, isLoading, login, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
