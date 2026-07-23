"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notificationsService } from "@/services";
import type { AppNotification } from "@/services/types";

const TYPE_LABELS: Record<string, string> = {
  task_assigned: "Tarefa",
  contract_signed: "Contrato",
  post_pending: "Conteúdo",
};

const POLL_INTERVAL_MS = 30_000;

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const [list, count] = await Promise.all([
        notificationsService.getNotifications(),
        notificationsService.getUnreadCount(),
      ]);
      setNotifications(list);
      setUnreadCount(count);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
    const interval = setInterval(() => void loadNotifications(), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  async function handleMarkRead(id: string) {
    await notificationsService.markAsRead(id);
    void loadNotifications();
  }

  async function handleMarkAllRead() {
    await notificationsService.markAllAsRead();
    void loadNotifications();
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="relative text-[var(--atria-primary)] hover:bg-[var(--atria-primary)]/5"
            aria-label="Notificações"
          />
        }
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-[#E8C39E] text-[9px] font-bold text-[#004949] ring-2 ring-[var(--atria-base)]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1">
          <DropdownMenuLabel className="p-0 text-[var(--atria-primary)]">
            Notificações
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="text-[var(--atria-primary)]/60"
              onClick={() => void handleMarkAllRead()}
            >
              <CheckCheck className="mr-1 size-3" />
              Marcar todas
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            Nenhuma notificação
          </p>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex cursor-pointer flex-col items-start gap-1 p-3 ${
                !notification.isRead ? "bg-[var(--atria-accent)]/10" : ""
              }`}
              onClick={() => void handleMarkRead(notification.id)}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-sm font-medium text-[var(--atria-primary)]">
                  {notification.title}
                </span>
                <span className="shrink-0 rounded-full bg-[var(--atria-primary)]/10 px-1.5 py-0.5 text-[9px] text-[var(--atria-primary)]/60">
                  {TYPE_LABELS[notification.type] ?? notification.type}
                </span>
              </div>
              <p className="line-clamp-2 text-xs text-[var(--atria-primary)]/60">
                {notification.message}
              </p>
              <span className="text-[10px] text-[var(--atria-primary)]/40">
                {new Date(notification.createdAt).toLocaleString("pt-BR")}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
