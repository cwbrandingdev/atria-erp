"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ContentPlatform, ContentPost } from "@/services/types";

const PLATFORMS: { id: ContentPlatform | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
  { id: "linkedin", label: "LinkedIn" },
];

const STATUS_STYLES = {
  draft: "bg-[var(--atria-primary)]/10 text-[var(--atria-primary)]",
  pending_approval: "bg-orange-100 text-orange-800",
  scheduled: "bg-[var(--atria-accent)]/40 text-[var(--atria-primary)]",
  published: "bg-green-100 text-green-700",
};

const STATUS_LABELS = {
  draft: "Rascunho",
  pending_approval: "Em Aprovação",
  scheduled: "Agendado",
  published: "Publicado",
};

const FORMAT_LABELS = {
  carousel: "Carrossel",
  reels: "Reels",
  static: "Estático",
  story: "Story",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface ContentPostGridProps {
  posts: ContentPost[];
  platform: ContentPlatform | "all";
  onPlatformChange: (platform: ContentPlatform | "all") => void;
  onSelectPost: (post: ContentPost) => void;
  loading?: boolean;
}

export function ContentPostGrid({
  posts,
  platform,
  onPlatformChange,
  onSelectPost,
  loading,
}: ContentPostGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPlatformChange(p.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                platform === p.id
                  ? "bg-[var(--atria-primary)] text-white"
                  : "bg-[var(--atria-primary)]/10 text-[var(--atria-primary)] hover:bg-[var(--atria-primary)]/20"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 rounded-lg border border-[var(--atria-primary)]/20 p-0.5">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-[var(--atria-primary)] text-white" : ""}
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-[var(--atria-primary)] text-white" : ""}
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--atria-primary)] border-t-transparent" />
        </div>
      ) : posts.length === 0 ? (
        <Card className="rounded-2xl border border-dashed border-[var(--atria-primary)]/20 p-12 text-center">
          <p className="text-sm text-[var(--atria-primary)]/50">
            Nenhum post encontrado para os filtros selecionados.
          </p>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="cursor-pointer rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                    style={{ backgroundColor: post.platformColor }}
                  >
                    {post.platform}
                  </span>
                  <span className="rounded-full bg-[var(--atria-accent)]/30 px-2 py-0.5 text-[10px] font-medium text-[var(--atria-primary)]">
                    {FORMAT_LABELS[post.format]}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[post.status]}`}
                >
                  {STATUS_LABELS[post.status]}
                </span>
              </div>

              <div className="mb-3 flex items-center gap-2">
                <Avatar className="size-7 border border-[var(--atria-accent)]/40">
                  {post.client.avatarUrl && (
                    <AvatarImage
                      src={post.client.avatarUrl}
                      alt={post.client.companyName}
                    />
                  )}
                  <AvatarFallback className="bg-[var(--atria-accent)] text-[9px] font-semibold text-[var(--atria-primary)]">
                    {getInitials(post.client.companyName)}
                  </AvatarFallback>
                </Avatar>
                <span className="rounded-full bg-[var(--atria-accent)]/20 px-2 py-0.5 text-xs font-medium text-[var(--atria-primary)]">
                  {post.client.companyName}
                </span>
              </div>

              <h3 className="mb-2 font-semibold text-[var(--atria-primary)]">
                {post.title}
              </h3>
              <p className="line-clamp-2 text-xs text-[var(--atria-primary)]/50">
                {post.copy}
              </p>
              {post.scheduledDate && (
                <p className="mt-3 text-[10px] text-[var(--atria-primary)]/40">
                  {new Date(post.scheduledDate).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <Card
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--atria-primary)]/10 bg-white p-4 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center gap-4">
                <span
                  className="h-8 w-1 rounded-full"
                  style={{ backgroundColor: post.platformColor }}
                />
                <Avatar className="size-8 border border-[var(--atria-accent)]/40">
                  {post.client.avatarUrl && (
                    <AvatarImage src={post.client.avatarUrl} />
                  )}
                  <AvatarFallback className="bg-[var(--atria-accent)] text-[10px] text-[var(--atria-primary)]">
                    {getInitials(post.client.companyName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-medium text-[var(--atria-primary)]">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[var(--atria-primary)]/50">
                    {post.client.companyName} · {post.platform} ·{" "}
                    {FORMAT_LABELS[post.format]}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[post.status]}`}
              >
                {STATUS_LABELS[post.status]}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
