import { apiRequest } from "./api";
import type {
  ProfitabilityOverview,
  TaskTimeSummary,
  TeamSummary,
  TimeLog,
} from "./types";

export async function getActiveTimer() {
  return apiRequest<TimeLog | null>("/time-logs/active");
}

export async function startTimer(taskId: string, notes?: string) {
  return apiRequest<TimeLog>("/time-logs/start", {
    method: "POST",
    body: { taskId, notes },
  });
}

export async function stopTimer(taskId: string) {
  return apiRequest<TimeLog>("/time-logs/stop", {
    method: "POST",
    body: { taskId },
  });
}

export async function getTaskTimeSummary(taskId: string) {
  return apiRequest<TaskTimeSummary>(`/time-logs/task/${taskId}`);
}

export async function getTeamSummary() {
  return apiRequest<TeamSummary>("/time-logs/summary");
}

export async function getProfitabilityOverview() {
  return apiRequest<ProfitabilityOverview>("/profitability/overview");
}
