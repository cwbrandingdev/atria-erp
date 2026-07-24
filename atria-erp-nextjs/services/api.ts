import {
  clearAuthStorage,
  getAccessToken,
  setAccessToken,
  setStoredUser,
} from "@/lib/auth-storage";
import { showApiError, shouldShowApiErrorToast } from "@/lib/toast";
import type { AuthResponse } from "@/services/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export { API_BASE_URL };

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  skipAuth?: boolean;
  skipToast?: boolean;
};

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        if (!response.ok) return null;

        const data = (await response.json()) as AuthResponse;
        const remember = Boolean(localStorage.getItem("atria_access_token"));
        setAccessToken(data.accessToken, remember);
        setStoredUser(data.user, remember);
        return data.accessToken;
      } catch {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, skipAuth, skipToast, ...rest } = options;

  const makeRequest = async (token: string | null) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...rest,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let token = skipAuth ? null : getAccessToken();
  let response = await makeRequest(token);

  if (response.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      token = newToken;
      response = await makeRequest(token);
    } else {
      clearAuthStorage();
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data as { message?: string | string[] })?.message ?? "Request failed";
    const error = new ApiError(
      Array.isArray(message) ? message.join(", ") : message,
      response.status,
      data,
    );

    if (!skipToast && shouldShowApiErrorToast(response.status, endpoint)) {
      showApiError(error, endpoint);
    }

    throw error;
  }

  return data as T;
}

export async function apiRequestBlob(
  endpoint: string,
  options: Omit<RequestOptions, "body"> = {},
): Promise<Blob> {
  const { headers, skipAuth, skipToast, ...rest } = options;

  const makeRequest = async (token: string | null) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...rest,
      credentials: "include",
      headers: {
        ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  };

  let token = skipAuth ? null : getAccessToken();
  let response = await makeRequest(token);

  if (response.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      token = newToken;
      response = await makeRequest(token);
    } else {
      clearAuthStorage();
    }
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const message =
      (data as { message?: string | string[] })?.message ?? "Request failed";
    const error = new ApiError(
      Array.isArray(message) ? message.join(", ") : message,
      response.status,
      data,
    );

    if (!skipToast && shouldShowApiErrorToast(response.status, endpoint)) {
      showApiError(error, endpoint);
    }

    throw error;
  }

  return response.blob();
}

export async function uploadFile<T>(
  endpoint: string,
  formData: FormData,
  options: { skipToast?: boolean; skipAuth?: boolean } = {},
): Promise<T> {
  const makeRequest = async (token: string | null) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
  };

  let token = options.skipAuth ? null : getAccessToken();
  let response = await makeRequest(token);

  if (response.status === 401 && !options.skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      token = newToken;
      response = await makeRequest(token);
    } else {
      clearAuthStorage();
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data as { message?: string | string[] })?.message ?? "Upload failed";
    const error = new ApiError(
      Array.isArray(message) ? message.join(", ") : message,
      response.status,
      data,
    );

    if (!options.skipToast && shouldShowApiErrorToast(response.status, endpoint)) {
      showApiError(error, endpoint);
    }

    throw error;
  }

  return data as T;
}
