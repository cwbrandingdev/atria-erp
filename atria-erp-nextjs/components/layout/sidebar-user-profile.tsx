"use client";

import { LogOut, MoreVertical, Palette, Settings, User } from "lucide-react";
import Link from "next/link";
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
  const labels: Record<string, string> = {
    admin: "Administrador",
    manager: "Gestor",
    user: "Usuário",
  };
  return labels[role.toLowerCase()] ?? role.charAt(0).toUpperCase() + role.slice(1);
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
    <div className={cn("shrink-0 p-3", className)}>
      <div className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-lg shadow-black/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <Avatar className="size-10 border border-white/15 ring-2 ring-[#E8C39E]/20">
              {user?.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={user.name} />
              )}
              <AvatarFallback className="bg-[#E8C39E]/90 text-xs font-bold text-[#004949]">
                {user ? getInitials(user.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#003838] bg-emerald-400" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name ?? "Usuário"}
            </p>
            <p className="truncate text-[11px] text-white/45">
              {user?.role ? formatRole(user.role) : "Membro"}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-white/50 hover:bg-white/10 hover:text-white"
                  aria-label="Opções do usuário"
                />
              }
            >
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{user?.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={<Link href="/settings/users" onClick={onAction} />}
              >
                <User className="size-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/settings/appearance" onClick={onAction} />}
              >
                <Palette className="size-4" />
                Personalizar tema
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/settings" onClick={onAction} />}
              >
                <Settings className="size-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => void handleLogout()}>
                <LogOut className="size-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
