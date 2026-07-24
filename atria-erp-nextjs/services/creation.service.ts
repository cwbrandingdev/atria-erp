import { apiRequest } from "./api";
import type {
  BriefContentPlan,
  BriefPlanCreateResult,
  ContentPlatform,
  CreateBriefPlanInput,
  CreationCommandCenter,
} from "./types";

export function getCommandCenter() {
  return apiRequest<CreationCommandCenter>("/creation/command-center");
}

export function generateFromBrief(data: {
  brief: string;
  clientId: string;
  platform?: ContentPlatform;
  objective?: string;
}) {
  const body: Record<string, unknown> = {
    brief: data.brief,
    clientId: data.clientId,
    objective: data.objective,
  };
  if (data.platform) body.platform = data.platform.toUpperCase();

  return apiRequest<BriefContentPlan>("/creation/brief-to-content/generate", {
    method: "POST",
    body,
  });
}

export function createFromBriefPlan(data: CreateBriefPlanInput) {
  return apiRequest<BriefPlanCreateResult>(
    "/creation/brief-to-content/create",
    {
      method: "POST",
      body: {
        clientId: data.clientId,
        platform: data.platform.toUpperCase(),
        createKanbanTasks: data.createKanbanTasks ?? true,
        ideas: data.ideas.map((idea) => ({
          ...idea,
          format: idea.format.toUpperCase(),
        })),
      },
    },
  );
}
