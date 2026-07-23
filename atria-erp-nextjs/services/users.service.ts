import { apiRequest } from "./api";
import type { ManagedUser, ProvisionUserInput, ProvisionUserResult } from "./types";

export async function getUsers(): Promise<ManagedUser[]> {
  return apiRequest<ManagedUser[]>("/users");
}

export async function provisionUser(
  data: ProvisionUserInput,
): Promise<ProvisionUserResult> {
  return apiRequest<ProvisionUserResult>("/users/provision", {
    method: "POST",
    body: data,
  });
}
