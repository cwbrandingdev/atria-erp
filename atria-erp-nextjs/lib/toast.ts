import { toast as sonnerToast } from "sonner";
import { ApiError } from "@/services/api";

export const toast = sonnerToast;

const SILENT_ENDPOINTS = ["/auth/refresh"];

export function shouldShowApiErrorToast(
  status: number,
  endpoint: string,
): boolean {
  if (SILENT_ENDPOINTS.some((path) => endpoint.startsWith(path))) {
    return false;
  }

  if (status === 401 && endpoint.startsWith("/auth/refresh")) {
    return false;
  }

  return status >= 400;
}

export function showApiError(error: ApiError, endpoint?: string) {
  if (endpoint?.startsWith("/auth/login")) {
    toast.error("E-mail ou senha inválidos");
    return;
  }

  toast.error(error.message || "Ocorreu um erro inesperado. Tente novamente.");
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) return error.message;
  return fallback;
}
