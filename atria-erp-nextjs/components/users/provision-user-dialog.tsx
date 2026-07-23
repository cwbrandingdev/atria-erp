"use client";

import { useEffect, useState } from "react";
import { Copy, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { GroupBadge } from "@/components/ui/group-badge";
import { ApiError, userGroupsService, usersService } from "@/services";
import type { ManagedUser, ProvisionUserResult, UserGroup } from "@/services/types";

interface ProvisionUserDialogProps {
  onSuccess: () => void;
}

const ROLE_OPTIONS = [
  { value: "USER", label: "Usuário" },
  { value: "MANAGER", label: "Gestor" },
  { value: "ADMIN", label: "Administrador" },
] as const;

export function ProvisionUserDialog({ onSuccess }: ProvisionUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [result, setResult] = useState<ProvisionUserResult | null>(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MANAGER" | "USER">("USER");
  const [userGroupId, setUserGroupId] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    void userGroupsService.getUserGroups().then(setGroups).catch(() => setGroups([]));
  }, [open]);

  function resetForm() {
    setName("");
    setRole("USER");
    setUserGroupId("");
    setHourlyRate("");
    setEmailDomain("");
    setError(null);
    setResult(null);
    setCopied(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await usersService.provisionUser({
        name: name.trim(),
        role,
        userGroupId: userGroupId || undefined,
        hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
        emailDomain: emailDomain.trim() || undefined,
      });
      setResult(response);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível provisionar o usuário.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyCredentials() {
    if (!result) return;
    const text = `E-mail: ${result.credentials.email}\nSenha temporária: ${result.credentials.temporaryPassword}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) resetForm();
      }}
    >
      <DialogTrigger
        render={
          <Button className="bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90" />
        }
      >
        <UserPlus className="size-4" />
        Adicionar Membro
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        {result ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-[var(--atria-primary)]">
                Usuário criado com sucesso
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <p className="text-sm text-[var(--atria-primary)]/70">
                Compartilhe as credenciais abaixo com{" "}
                <strong>{result.user.name}</strong>. O usuário deverá alterar a
                senha no primeiro acesso.
              </p>

              <div className="rounded-xl border border-[var(--atria-accent)]/50 bg-[var(--atria-accent)]/10 p-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[var(--atria-primary)]/50">
                      E-mail
                    </p>
                    <p className="font-mono text-[var(--atria-primary)]">
                      {result.credentials.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[var(--atria-primary)]/50">
                      Senha temporária
                    </p>
                    <p className="font-mono text-[var(--atria-primary)]">
                      {result.credentials.temporaryPassword}
                    </p>
                  </div>
                </div>
              </div>

              {result.user.userGroup && (
                <GroupBadge
                  name={result.user.userGroup.name}
                  color={result.user.userGroup.color}
                />
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={() => void copyCredentials()}
                className="bg-[var(--atria-primary)] text-white"
              >
                <Copy className="size-4" />
                {copied ? "Copiado!" : "Copiar Credenciais"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                }}
              >
                Fechar
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-[var(--atria-primary)]">
                Provisionar Novo Usuário
              </DialogTitle>
            </DialogHeader>

            <FieldGroup className="py-4">
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <Field>
                <FieldLabel htmlFor="pu-name">Nome completo *</FieldLabel>
                <Input
                  id="pu-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="João Silva"
                  required
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="pu-role">Função *</FieldLabel>
                  <select
                    id="pu-role"
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value as "ADMIN" | "MANAGER" | "USER")
                    }
                    className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="pu-rate">Valor/hora (R$)</FieldLabel>
                  <Input
                    id="pu-rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="0,00"
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="pu-group">Grupo de equipe</FieldLabel>
                <select
                  id="pu-group"
                  value={userGroupId}
                  onChange={(e) => setUserGroupId(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
                >
                  <option value="">Sem grupo</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="pu-domain">Domínio do e-mail</FieldLabel>
                <Input
                  id="pu-domain"
                  value={emailDomain}
                  onChange={(e) => setEmailDomain(e.target.value)}
                  placeholder="atria.com (padrão)"
                />
              </Field>
            </FieldGroup>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[var(--atria-primary)] text-white"
              >
                {loading ? "Criando..." : "Criar Usuário"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface UsersListProps {
  users: ManagedUser[];
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  manager: "Gestor",
  user: "Usuário",
};

export function UsersList({ users }: UsersListProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--atria-primary)]/20 p-12 text-center">
        <p className="text-sm text-[var(--atria-primary)]/50">
          Nenhum usuário cadastrado. Adicione o primeiro membro da equipe.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5"
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-[var(--atria-primary)]">
                {user.name}
              </h3>
              <p className="text-sm text-[var(--atria-primary)]/60">
                {user.email}
              </p>
            </div>
            {user.userGroup && (
              <GroupBadge
                name={user.userGroup.name}
                color={user.userGroup.color}
              />
            )}
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-[var(--atria-primary)]/10 px-2.5 py-0.5 font-medium text-[var(--atria-primary)]">
              {ROLE_LABELS[user.role] ?? user.role}
            </span>
            {user.hourlyRate !== null && (
              <span className="rounded-full bg-[var(--atria-accent)]/30 px-2.5 py-0.5 font-medium text-[var(--atria-primary)]">
                R$ {user.hourlyRate.toFixed(2)}/h
              </span>
            )}
            {user.mustChangePassword && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 font-medium text-amber-700">
                Senha pendente
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
