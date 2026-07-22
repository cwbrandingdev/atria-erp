import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";

interface WelcomeHeaderProps {
  userName: string;
  notificationCount: number;
}

export function WelcomeHeader({
  userName,
  notificationCount,
}: WelcomeHeaderProps) {
  const hasNotifications = notificationCount > 0;

  return (
    <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--atria-primary)] sm:text-2xl">
            Olá, {userName}!
          </h1>
          <p className="mt-1 text-sm text-[var(--atria-primary)]/50">
            {hasNotifications
              ? `Você tem ${notificationCount} pendência${notificationCount > 1 ? "s" : ""} aguardando atenção.`
              : "Resumo executivo das suas áreas."}
          </p>
        </div>

        <div className="relative self-start rounded-xl bg-[var(--atria-accent)]/20 p-3 text-[var(--atria-primary)] sm:self-auto">
          <Bell className="size-5" />
          {hasNotifications && (
            <span className="absolute top-2 right-2 size-2.5 rounded-full bg-[var(--atria-primary)] ring-2 ring-white" />
          )}
        </div>
      </div>
    </Card>
  );
}
