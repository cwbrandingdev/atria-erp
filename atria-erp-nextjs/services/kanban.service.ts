import { apiRequest } from "./api";
import type {
  CreateColumnInput,
  CreateTaskInput,
  KanbanColumn,
  KanbanTask,
  TaskComment,
  TaskHistoryEntry,
  UpdateColumnInput,
} from "./types";

export async function getColumns(): Promise<KanbanColumn[]> {
  return apiRequest<KanbanColumn[]>("/kanban/columns");
}

export async function createColumn(
  data: CreateColumnInput,
): Promise<KanbanColumn> {
  return apiRequest<KanbanColumn>("/kanban/columns", {
    method: "POST",
    body: data,
  });
}

export async function updateColumn(
  id: string,
  data: UpdateColumnInput,
): Promise<KanbanColumn> {
  return apiRequest<KanbanColumn>(`/kanban/columns/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteColumn(id: string): Promise<void> {
  return apiRequest<void>(`/kanban/columns/${id}`, { method: "DELETE" });
}

export async function reorderColumns(
  items: { id: string; order: number }[],
): Promise<KanbanColumn[]> {
  return apiRequest<KanbanColumn[]>("/kanban/columns/reorder", {
    method: "PATCH",
    body: { items },
  });
}

export async function getTasks(params?: {
  columnId?: string;
}): Promise<KanbanTask[]> {
  const query = params?.columnId ? `?columnId=${params.columnId}` : "";
  return apiRequest<KanbanTask[]>(`/kanban/tasks${query}`);
}

export async function getTask(id: string): Promise<KanbanTask> {
  return apiRequest<KanbanTask>(`/kanban/tasks/${id}`);
}

export async function createTask(data: CreateTaskInput): Promise<KanbanTask> {
  return apiRequest<KanbanTask>("/kanban/tasks", {
    method: "POST",
    body: {
      ...data,
      priority: data.priority?.toUpperCase(),
    },
  });
}

export async function updateTask(
  id: string,
  data: Partial<CreateTaskInput>,
): Promise<KanbanTask> {
  const body: Record<string, unknown> = { ...data };
  if (data.priority) body.priority = data.priority.toUpperCase();

  return apiRequest<KanbanTask>(`/kanban/tasks/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function moveTask(
  id: string,
  columnId: string,
  order: number,
): Promise<KanbanTask> {
  return apiRequest<KanbanTask>(`/kanban/tasks/${id}/move`, {
    method: "PATCH",
    body: { columnId, order },
  });
}

export async function deleteTask(id: string): Promise<void> {
  return apiRequest<void>(`/kanban/tasks/${id}`, { method: "DELETE" });
}

export async function getComments(taskId: string): Promise<TaskComment[]> {
  return apiRequest<TaskComment[]>(`/kanban/tasks/${taskId}/comments`);
}

export async function createComment(
  taskId: string,
  content: string,
): Promise<TaskComment> {
  return apiRequest<TaskComment>(`/kanban/tasks/${taskId}/comments`, {
    method: "POST",
    body: { content },
  });
}

export async function getHistory(
  taskId: string,
): Promise<TaskHistoryEntry[]> {
  return apiRequest<TaskHistoryEntry[]>(`/kanban/tasks/${taskId}/history`);
}
