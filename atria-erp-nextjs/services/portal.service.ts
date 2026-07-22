import { apiRequest } from "./api";
import type { ClientReport, PortalData } from "./types";

export async function getPortalData(token: string) {
  return apiRequest<PortalData>(`/portal/${token}`, { skipAuth: true });
}

export async function getPortalReport(token: string, reportId: string) {
  return apiRequest<ClientReport>(`/portal/${token}/reports/${reportId}`, {
    skipAuth: true,
  });
}
