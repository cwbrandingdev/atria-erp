import { apiRequest } from "./api";
import type { KanbanBoard, KanbanCard, KanbanColumn } from "./types";

export async function getBoards(): Promise<KanbanBoard[]> {
  return apiRequest<KanbanBoard[]>("/kanban/boards");
}

export async function getBoard(boardId: string): Promise<KanbanBoard> {
  return apiRequest<KanbanBoard>(`/kanban/boards/${boardId}`);
}

export async function createBoard(name: string): Promise<KanbanBoard> {
  return apiRequest<KanbanBoard>("/kanban/boards", {
    method: "POST",
    body: { name },
  });
}

export async function createColumn(
  boardId: string,
  data: Pick<KanbanColumn, "title" | "order">,
): Promise<KanbanColumn> {
  return apiRequest<KanbanColumn>(`/kanban/boards/${boardId}/columns`, {
    method: "POST",
    body: data,
  });
}

export async function createCard(
  boardId: string,
  data: Omit<KanbanCard, "id">,
): Promise<KanbanCard> {
  return apiRequest<KanbanCard>(`/kanban/boards/${boardId}/cards`, {
    method: "POST",
    body: data,
  });
}

export async function updateCard(
  boardId: string,
  cardId: string,
  data: Partial<KanbanCard>,
): Promise<KanbanCard> {
  return apiRequest<KanbanCard>(`/kanban/boards/${boardId}/cards/${cardId}`, {
    method: "PATCH",
    body: data,
  });
}

export async function moveCard(
  boardId: string,
  cardId: string,
  columnId: string,
  order: number,
): Promise<KanbanCard> {
  return apiRequest<KanbanCard>(
    `/kanban/boards/${boardId}/cards/${cardId}/move`,
    {
      method: "PATCH",
      body: { columnId, order },
    },
  );
}

export async function deleteCard(
  boardId: string,
  cardId: string,
): Promise<void> {
  return apiRequest<void>(`/kanban/boards/${boardId}/cards/${cardId}`, {
    method: "DELETE",
  });
}
