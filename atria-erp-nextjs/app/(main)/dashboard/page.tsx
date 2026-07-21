import Link from "next/link";
import {
  ArrowRight,
  DollarSign,
  Kanban,
  Palette,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import Welcome from "./components/Welcome";
import TodaySchedule from "./components/TodaySchedule";
import QuickNotifications from "./components/QuickNotifications";

const areas = [
  {
    title: "Financeiro",
    href: "/dashboards/financeiro",
    icon: DollarSign,
    metrics: [
      { label: "Saldo", value: "R$ 48.200" },
      { label: "Receita", value: "R$ 62.400" },
    ],
  },
  {
    title: "Criação",
    href: "/dashboards/criacao",
    icon: Palette,
    metrics: [
      { label: "Em produção", value: "12" },
      { label: "Aprovados", value: "8" },
    ],
  },
  {
    title: "Performance",
    href: "/dashboards/performance",
    icon: TrendingUp,
    metrics: [
      { label: "Views", value: "405K" },
      { label: "Engajamento", value: "7.1%" },
    ],
  },
  {
    title: "Kanban",
    href: "/kanban",
    icon: Kanban,
    metrics: [
      { label: "Tarefas", value: "24" },
      { label: "Em progresso", value: "7" },
    ],
  },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <Welcome userName="Usuário" notificationCount={3} />

      <div>
        <h2 className="mb-4 text-lg font-semibold text-[#013C3C]">
          Visão geral das áreas
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((area) => {
            const Icon = area.icon;
            return (
              <Link key={area.href} href={area.href}>
                <Card className="group h-full rounded-2xl border border-[#013C3C]/10 bg-white p-5 transition-shadow hover:shadow-md">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-xl bg-[#E8C39E]/30 p-2.5 text-[#013C3C]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#013C3C]/30 transition-transform group-hover:translate-x-0.5 group-hover:text-[#013C3C]" />
                  </div>
                  <h3 className="mb-3 font-semibold text-[#013C3C]">
                    {area.title}
                  </h3>
                  <div className="flex gap-4">
                    {area.metrics.map((m) => (
                      <div key={m.label}>
                        <p className="text-lg font-bold text-[#013C3C]">
                          {m.value}
                        </p>
                        <p className="text-xs text-[#013C3C]/50">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TodaySchedule />
        <QuickNotifications />
      </div>
    </div>
  );
}
