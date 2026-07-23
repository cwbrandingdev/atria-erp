"use client";

import { useCallback, useEffect, useState } from "react";
import { SettingsNav } from "@/components/settings/settings-nav";
import { ProvisionUserDialog, UsersList } from "@/components/users/provision-user-dialog";
import { UserGroupsManager } from "@/components/users/user-groups-manager";
import { usersService } from "@/services";
import type { ManagedUser } from "@/services/types";

export default function SettingsUsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await usersService.getUsers();
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--atria-primary)]">
          Configurações
        </h1>
        <p className="text-sm text-[var(--atria-primary)]/50">
          Gerencie usuários, grupos de equipe e provisionamento de acesso
        </p>
      </div>

      <SettingsNav />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--atria-primary)]">
            Equipe
          </h2>
          <p className="text-sm text-[var(--atria-primary)]/50">
            {users.length} membro{users.length === 1 ? "" : "s"} cadastrado
            {users.length === 1 ? "" : "s"}
          </p>
        </div>
        <ProvisionUserDialog onSuccess={() => void loadUsers()} />
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--atria-primary)] border-t-transparent" />
        </div>
      ) : (
        <UsersList users={users} />
      )}

      <UserGroupsManager onChange={() => void loadUsers()} />
    </div>
  );
}
