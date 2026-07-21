import { Bell, CheckCircle2, XCircle, ChevronRight } from "lucide-react";

export default function QuickNotifications() {
  const notifications = [
    {
      id: 1,
      type: "rejected",
      title: "Arte reprovada pelo cliente",
      description:
        "O cliente reprovou CARROSSEL CHEFE OU LÍDER. Feedback: Na imagem 2, precisa trocar um ponto por uma vírgula...",
      time: "Há 10 min",
    },
    {
      id: 2,
      type: "approved",
      title: "Arte aprovada pelo cliente",
      description:
        "O cliente aprovou POST DIA DOS PAIS sem alterações. Pronto para agendamento.",
      time: "Há 1 hora",
    },
  ];

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-100 mt-4 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#004C4C]/10 text-[#004C4C]">
            <Bell size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Notificações recentes
            </h2>
            <p className="text-xs text-slate-400">Atualizações do seu fluxo</p>
          </div>
        </div>
        <span className="rounded-full bg-[#004C4C]/10 px-2.5 py-0.5 text-xs font-semibold text-[#004C4C]">
          {notifications.length} novas
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {notifications.map((notification) => {
          const isApproved = notification.type === "approved";

          return (
            <div
              key={notification.id}
              className="group relative flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition-all hover:border-slate-200 hover:bg-slate-50"
            >
              <div className="mt-0.5 shrink-0">
                {isApproved ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : (
                  <XCircle size={18} className="text-rose-500" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-[#004C4C]">
                    {notification.title}
                  </h3>
                  <span className="shrink-0 text-[10px] font-medium text-slate-400">
                    {notification.time}
                  </span>
                </div>
                <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                  {notification.description}
                </p>
              </div>

              <ChevronRight
                size={16}
                className="mt-1 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500"
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-xl py-2 text-center text-xs font-semibold text-[#004C4C] transition-colors hover:bg-[#004C4C]/5"
      >
        Ver todas as notificações
      </button>
    </div>
  );
}
