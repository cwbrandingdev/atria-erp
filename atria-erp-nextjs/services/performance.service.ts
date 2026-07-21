import { apiRequest } from "./api";
import type { PerformanceOverview, PerformanceSummary, Platform } from "./types";

export async function getPerformanceOverview(): Promise<PerformanceOverview> {
  return apiRequest<PerformanceOverview>("/performance/overview");
}

export async function getSummaries(params?: {
  platform?: Platform;
}): Promise<PerformanceSummary[]> {
  const query = params?.platform
    ? `?platform=${params.platform}`
    : "";

  return apiRequest<PerformanceSummary[]>(`/performance/summaries${query}`);
}

export async function getSummary(id: string): Promise<PerformanceSummary> {
  return apiRequest<PerformanceSummary>(`/performance/summaries/${id}`);
}
