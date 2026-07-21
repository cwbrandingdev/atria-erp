import { apiRequest } from "./api";
import type { AuthResponse, LoginCredentials, User } from "./types";

export async function login(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: credentials,
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("atria_token", response.token);
    localStorage.setItem("atria_user", JSON.stringify(response.user));
  }

  return response;
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<void>("/auth/logout", { method: "POST" });
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("atria_token");
      localStorage.removeItem("atria_user");
    }
  }
}

export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>("/auth/me");
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("atria_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("atria_token"));
}
