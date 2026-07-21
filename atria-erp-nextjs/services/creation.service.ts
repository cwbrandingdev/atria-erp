import { apiRequest } from "./api";
import type { ContentItem, CreationOverview } from "./types";

export async function getCreationOverview(): Promise<CreationOverview> {
  return apiRequest<CreationOverview>("/creation/overview");
}

export async function getContentItems(params?: {
  status?: ContentItem["status"];
  client?: string;
}): Promise<ContentItem[]> {
  const query = new URLSearchParams(
    Object.entries(params ?? {})
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)]),
  ).toString();

  return apiRequest<ContentItem[]>(
    `/creation/items${query ? `?${query}` : ""}`,
  );
}

export async function createContentItem(
  data: Omit<ContentItem, "id">,
): Promise<ContentItem> {
  return apiRequest<ContentItem>("/creation/items", {
    method: "POST",
    body: data,
  });
}

export async function updateContentItem(
  id: string,
  data: Partial<ContentItem>,
): Promise<ContentItem> {
  return apiRequest<ContentItem>(`/creation/items/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteContentItem(id: string): Promise<void> {
  return apiRequest<void>(`/creation/items/${id}`, { method: "DELETE" });
}
