"use client";

import {
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Sparkles,
  Upload,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ContentItem } from "@/services/types";

const stats = [
  { label: "Em produção", value: 12, icon: Sparkles },
  { label: "Em revisão", value: 5, icon: Eye },
  { label: "Aprovados", value: 8, icon: CheckCircle },
  { label: "Publicados", value: 23, icon: Upload },
];

const contentItems: ContentItem[] = [
  {
    id: "1",
    title: "Reels — Lançamento Produto Verão",
    client: "Cliente A",
    type: "reels",
    status: "production",
    dueDate: "22 Jul",
    assignee: "Ana",
  },
  {
    id: "2",
    title: "Carrossel Instagram — Dicas de Marketing",
    client: "Cliente B",
    type: "post",
    status: "review",
    dueDate: "21 Jul",
    assignee: "Carlos",
  },
  {
    id: "3",
    title: "Vídeo TikTok — Behind the Scenes",
    client: "Cliente C",
    type: "video",
    status: "briefing",
    dueDate: "25 Jul",
    assignee: "Marina",
  },
  {
    id: "4",
    title: "Stories — Promoção Flash",
    client: "Cliente A",
    type: "story",
    status: "approved",
    dueDate: "20 Jul",
    assignee: "Ana",
  },
  {
    id: "5",
    title: "Campanha Meta Ads — Q3",
    client: "Cliente D",
    type: "campaign",
    status: "production",
    dueDate: "28 Jul",
    assignee: "Pedro",
  },
];

const statusLabels: Record<ContentItem["status"], string> = {
  briefing: "Briefing",
  production: "Produção",
  review: "Revisão",
  approved: "Aprovado",
  published: "Publicado",
};

const statusColors: Record<ContentItem["status"], string> = {
  briefing: "bg-[#013C3C]/10 text-[#013C3C]/70",
  production: "bg-[#E8C39E]/40 text-[#013C3C]",
  review: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  published: "bg-[#013C3C] text-white",
};

export default function CreationDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#013C3C]">
          Dashboard de Criação
        </h1>
        <p className="text-sm text-[#013C3C]/50">
          Pipeline de conteúdo para agência de marketing
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="rounded-2xl border border-[#013C3C]/10 bg-white p-5"
            >
              <div className="mb-3 rounded-xl bg-[#E8C39E]/30 p-2 w-fit text-[#013C3C]">
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold text-[#013C3C]">{stat.value}</p>
              <p className="text-xs text-[#013C3C]/50">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-2xl border border-[#013C3C]/10 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#013C3C]" />
          <h2 className="font-semibold text-[#013C3C]">Conteúdos em andamento</h2>
        </div>

        <div className="flex flex-col gap-3">
          {contentItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-xl border border-[#013C3C]/10 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="text-sm font-medium text-[#013C3C]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#013C3C]/50">
                  {item.client} · {item.type}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-[#013C3C]/50">
                  <Clock className="h-3 w-3" />
                  {item.dueDate}
                </span>
                {item.assignee && (
                  <span className="rounded-full bg-[#E8C39E]/30 px-2 py-0.5 text-[10px] font-medium text-[#013C3C]">
                    {item.assignee}
                  </span>
                )}
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[item.status]}`}
                >
                  {statusLabels[item.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
