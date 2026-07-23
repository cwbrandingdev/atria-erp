"use client";

import { useState } from "react";
import Link from "next/link";
import { AtSign, MapPin, PenLine, Phone, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GroupBadge } from "@/components/ui/group-badge";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
import type { Client } from "@/services/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface ClientCardProps {
  client: Client;
  onUpdate: () => void;
}

export function ClientCard({ client, onUpdate }: ClientCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 border border-[var(--atria-accent)]/40">
              {client.avatarUrl && (
                <AvatarImage src={client.avatarUrl} alt={client.companyName} />
              )}
              <AvatarFallback className="bg-[var(--atria-accent)] font-semibold text-[var(--atria-primary)]">
                {getInitials(client.companyName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-[var(--atria-primary)]">
                {client.companyName}
              </h3>
              {client.contactName && (
                <p className="text-xs text-[var(--atria-primary)]/50">
                  {client.contactName}
                </p>
              )}
              {client.clientGroup && (
                <div className="mt-1.5">
                  <GroupBadge
                    name={client.clientGroup.name}
                    color={client.clientGroup.color}
                  />
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="size-4" />
          </Button>
        </div>

        <div className="mb-4 flex flex-col gap-2 text-sm text-[var(--atria-primary)]/70">
          {client.instagram && (
            <div className="flex items-center gap-2">
              <AtSign className="size-4 text-[var(--atria-primary)]/40" />
              <span>{client.instagram}</span>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-[var(--atria-primary)]/40" />
              <span>{client.phone}</span>
            </div>
          )}
          {client.address && (
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--atria-primary)]/40" />
              <span className="line-clamp-2">{client.address}</span>
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--atria-primary)]/10 pt-4">
          <span className="rounded-full bg-[var(--atria-accent)]/30 px-2.5 py-0.5 text-xs font-medium text-[var(--atria-primary)]">
            {client.postCount} post{client.postCount === 1 ? "" : "s"}
          </span>
          <Link
            href={`/content?clientId=${client.id}&create=1`}
            className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-[var(--atria-primary)] px-2.5 text-sm font-medium text-white hover:bg-[var(--atria-primary)]/90"
          >
            <PenLine className="size-4" />
            Criar Conteúdo
          </Link>
        </div>
      </Card>

      <ClientFormDialog
        client={client}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={onUpdate}
        trigger={false}
      />
    </>
  );
}
