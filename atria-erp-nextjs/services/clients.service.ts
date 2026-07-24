import { apiRequest } from "./api";
import type {
  Client,
  Client360Data,
  Client360Section,
  CreateClientInput,
  UpdateClientInput,
} from "./types";

export async function getClients(clientGroupId?: string): Promise<Client[]> {
  const query = clientGroupId
    ? `?clientGroupId=${encodeURIComponent(clientGroupId)}`
    : "";
  return apiRequest<Client[]>(`/clients${query}`);
}

export async function getClient(id: string): Promise<Client> {
  return apiRequest<Client>(`/clients/${id}`);
}

export async function getClient360<T extends Client360Data = Client360Data>(
  id: string,
  section: Client360Section = "summary",
): Promise<T> {
  return apiRequest<T>(`/clients/${id}/360?section=${section}`);
}

export async function createClient(data: CreateClientInput): Promise<Client> {
  return apiRequest<Client>("/clients", {
    method: "POST",
    body: data,
  });
}

export async function updateClient(
  id: string,
  data: UpdateClientInput,
): Promise<Client> {
  return apiRequest<Client>(`/clients/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteClient(id: string): Promise<void> {
  return apiRequest<void>(`/clients/${id}`, { method: "DELETE" });
}
