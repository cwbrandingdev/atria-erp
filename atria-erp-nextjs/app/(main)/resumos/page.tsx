"use client";

import { useState } from "react";
import { PlatformFilter } from "./components/PlatformFilter";
import { SummaryCard } from "./components/SumaryCard";
import { SummaryData, Platform } from "./components/types";

const mockSummaries: SummaryData[] = [
  {
    id: "1",
    platform: "tiktok",
    title: "Viralização: Setup M2 Pro vs Hackintosh Ryzen",
    description:
      "Análise de retenção de pico no TikTok durante demonstrações de código e benchmarks.",
    views: 245000,
    newFollowers: 3420,
    engagementRate: "9.8%",
    totalComments: 890,
    sharesCount: 1240,
    date: "Hoje",
    viewsTrend: [
      { time: "00h", views: 5000 },
      { time: "06h", views: 22000 },
      { time: "12h", views: 98000 },
      { time: "18h", views: 180000 },
      { time: "24h", views: 245000 },
    ],
    followerGrowth: [
      { date: "Seg", followers: 420 },
      { date: "Ter", followers: 680 },
      { date: "Qua", followers: 1100 },
      { date: "Qui", followers: 820 },
      { date: "Sex", followers: 400 },
    ],
  },
  {
    id: "2",
    platform: "instagram",
    title: "Reels: Arquitetura NestJS e Prisma na Prática",
    description:
      "Conversão direta de salvamentos para novos seguidores focados em programação back-end.",
    views: 112000,
    newFollowers: 1850,
    engagementRate: "7.4%",
    totalComments: 430,
    sharesCount: 910,
    date: "Ontem",
    viewsTrend: [
      { time: "00h", views: 2000 },
      { time: "06h", views: 15000 },
      { time: "12h", views: 45000 },
      { time: "18h", views: 88000 },
      { time: "24h", views: 112000 },
    ],
    followerGrowth: [
      { date: "Seg", followers: 210 },
      { date: "Ter", followers: 340 },
      { date: "Qua", followers: 650 },
      { date: "Qui", followers: 420 },
      { date: "Sex", followers: 230 },
    ],
  },
  {
    id: "3",
    platform: "facebook",
    title: "Post de Grupo: Automação no ServiceNow com Flow Designer",
    description:
      "Alcance contínuo dentro de grupos especializados e fóruns de tecnologia.",
    views: 48500,
    newFollowers: 410,
    engagementRate: "4.2%",
    totalComments: 190,
    sharesCount: 120,
    date: "18 Jul",
    viewsTrend: [
      { time: "00h", views: 1000 },
      { time: "06h", views: 8000 },
      { time: "12h", views: 22000 },
      { time: "18h", views: 36000 },
      { time: "24h", views: 48500 },
    ],
    followerGrowth: [
      { date: "Seg", followers: 50 },
      { date: "Ter", followers: 80 },
      { date: "Qua", followers: 140 },
      { date: "Qui", followers: 90 },
      { date: "Sex", followers: 50 },
    ],
  },
];

export default function SocialSummaries() {
  const [filter, setFilter] = useState<Platform>("all");

  const filteredSummaries = mockSummaries.filter((item) => {
    if (filter === "all") return true;
    return item.platform === filter;
  });

  return (
    <div className="w-full max-w-7xl p-8 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard Analytics por Vídeo/Post
          </h1>
          <p className="text-sm font-medium text-slate-400">
            Resumos detalhados com gráficos de crescimento e métricas de
            conversão
          </p>
        </div>

        <PlatformFilter activeFilter={filter} onFilterChange={setFilter} />
      </div>

      <div className="flex flex-col gap-6">
        {filteredSummaries.length > 0 ? (
          filteredSummaries.map((summary) => (
            <SummaryCard key={summary.id} data={summary} />
          ))
        ) : (
          <div className="py-12 text-center text-slate-400 text-sm font-medium bg-white rounded-3xl border border-slate-100">
            Nenhum resumo encontrado para esta plataforma.
          </div>
        )}
      </div>
    </div>
  );
}
