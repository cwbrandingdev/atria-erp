import React from "react";
import { Bell } from "lucide-react";

interface WelcomeBannerProps {
  userName?: string;
  notificationCount?: number;
}

export default function WelcomeBanner({
  userName = "Usuário",
  notificationCount = 0,
}: WelcomeBannerProps) {
  const hasNotifications = notificationCount > 0;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-slate-100 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Olá, {userName}! 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {hasNotifications
            ? `Você tem ${notificationCount} ${
                notificationCount === 1
                  ? "nova notificação"
                  : "novas notificações"
              } aguardando sua atenção.`
            : "Você não tem nenhuma notificação pendente no momento."}
        </p>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto">
        <div className="relative p-3 bg-slate-50 rounded-xl text-slate-600">
          <Bell className="w-6 h-6" />
          {hasNotifications && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-2 ring-white" />
          )}
        </div>
      </div>
    </div>
  );
}
