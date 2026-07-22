"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ContentMetrics } from "@/components/content/content-metrics";
import { ContentCalendarOverview } from "@/components/content/content-calendar-overview";
import { ContentPostGrid } from "@/components/content/content-post-grid";
import { PostFormDialog } from "@/components/content/post-form-dialog";
import { contentService, clientsService } from "@/services";
import type {
  Client,
  ContentCalendarItem,
  ContentOverview,
  ContentPlatform,
  ContentPost,
} from "@/services/types";

export default function ContentPage() {
  const searchParams = useSearchParams();
  const initialClientId = searchParams.get("clientId") ?? "all";
  const shouldOpenCreate = searchParams.get("create") === "1";

  const [overview, setOverview] = useState<ContentOverview | null>(null);
  const [calendarItems, setCalendarItems] = useState<ContentCalendarItem[]>([]);
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState<string>(initialClientId);
  const [platform, setPlatform] = useState<ContentPlatform | "all">("all");
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(shouldOpenCreate);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientsService.getClients().then(setClients).catch(() => setClients([]));
  }, []);

  useEffect(() => {
    if (initialClientId !== "all") {
      setClientId(initialClientId);
    }
  }, [initialClientId]);

  useEffect(() => {
    if (shouldOpenCreate) {
      setCreateOpen(true);
    }
  }, [shouldOpenCreate]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const to = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
      ).toISOString();

      const clientFilter = clientId !== "all" ? clientId : undefined;

      const [overviewData, calendarData, postsData] = await Promise.all([
        contentService.getOverview(clientFilter),
        contentService.getCalendar({ from, to, clientId: clientFilter }),
        contentService.getPosts({
          clientId: clientFilter,
          platform: platform !== "all" ? platform : undefined,
        }),
      ]);

      setOverview(overviewData);
      setCalendarItems(calendarData);
      setPosts(postsData);
    } catch {
      setOverview(null);
      setCalendarItems([]);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [clientId, platform]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  function handleSelectPost(post: ContentPost) {
    setSelectedPost(post);
    setEditOpen(true);
  }

  if (loading && !overview) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--atria-primary)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--atria-primary)]">
            Criação de Conteúdo
          </h1>
          <p className="text-sm text-[var(--atria-primary)]/50">
            Planeje, agende e publique posts nas redes sociais
          </p>
        </div>
        <PostFormDialog
          clients={clients}
          defaultClientId={clientId !== "all" ? clientId : undefined}
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSuccess={() => void loadData()}
        />
      </div>

      <div className="rounded-2xl border border-[var(--atria-primary)]/10 bg-[var(--atria-accent)]/5 p-4">
        <label
          htmlFor="client-filter"
          className="mb-2 block text-sm font-medium text-[var(--atria-primary)]"
        >
          Filtrar por Cliente
        </label>
        <select
          id="client-filter"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="h-10 w-full max-w-md rounded-xl border border-[var(--atria-primary)]/20 bg-white px-3 text-sm text-[var(--atria-primary)] sm:w-auto sm:min-w-[280px]"
        >
          <option value="all">Todos os Clientes</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.companyName}
            </option>
          ))}
        </select>
      </div>

      {overview && <ContentMetrics overview={overview} />}

      <ContentCalendarOverview items={calendarItems} />

      <ContentPostGrid
        posts={posts}
        platform={platform}
        onPlatformChange={setPlatform}
        onSelectPost={handleSelectPost}
        loading={loading}
      />

      <PostFormDialog
        post={selectedPost}
        clients={clients}
        open={editOpen}
        onOpenChange={(value) => {
          setEditOpen(value);
          if (!value) setSelectedPost(null);
        }}
        onSuccess={() => void loadData()}
        trigger={false}
      />
    </div>
  );
}
