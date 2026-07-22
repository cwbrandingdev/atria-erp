"use client";

import { LogOut, MoreVertical } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatRole(role: string) {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

interface SidebarUserProfileProps {
  onAction?: () => void;
  className?: string;
}

export function SidebarUserProfile({
  onAction,
  className,
}: SidebarUserProfileProps) {
  const { user, logout } = useAuth();

  async function handleLogout() {
    onAction?.();
    await logout();
  }

  return (
    <div
      className={cn(
        "border-t border-white/10 bg-[#003838] p-4",
        className,
      )}
    >
      <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
        <Avatar className="size-10 border border-[var(--atria-accent)]/40">
          {user?.avatarUrl && (
            <AvatarImage src={user.avatarUrl} alt={user.name} />
          )}
          <AvatarFallback className="bg-[var(--atria-accent)] font-semibold text-[var(--atria-primary)]">
            {user ? getInitials(user.name) : "?"}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {user?.name ?? "Usuário"}
          </p>
          <p className="truncate text-xs text-[var(--atria-accent)]">
            {user?.role ? formatRole(user.role) : "Membro"}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Opções do usuário"
              />
            }
          >
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void handleLogout()}>
              <LogOut className="size-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
