import { apiRequest } from "./api";
import {
  clearAuthStorage,
  getAccessToken,
  getStoredUser,
  setAccessToken,
  setStoredUser,
} from "@/lib/auth-storage";
import type { AuthResponse, LoginCredentials, User } from "./types";

export async function login(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: credentials,
    skipAuth: true,
  });

  setAccessToken(response.accessToken);
  setStoredUser(response.user);

  return response;
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<void>("/auth/logout", { method: "POST" });
  } finally {
    clearAuthStorage();
  }
}

export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>("/auth/me");
}

export { getStoredUser };

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}
