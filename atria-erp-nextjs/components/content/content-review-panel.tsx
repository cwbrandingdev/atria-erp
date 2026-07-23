"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Save, XCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ContentStatusBadge } from "@/components/content/content-status-badge";
import { RejectPostDialog } from "@/components/content/reject-post-dialog";
import { VersionHistoryDrawer } from "@/components/content/version-history-drawer";
import {
  formatContentDate,
  isMediaVideo,
  LIQUID_GLASS_ACCENT_CLASS,
  LIQUID_GLASS_CLASS,
} from "@/lib/content-utils";
import { toast } from "@/lib/toast";
import { contentService } from "@/services";
import type {
  ContentPost,
  PostHistory,
  PostVersion,
} from "@/services/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface ContentReviewPanelProps {
  post: ContentPost;
  history: PostHistory;
  onRefresh: () => Promise<void>;
  showBackLink?: boolean;
}

export function ContentReviewPanel({
  post,
  history,
  onRefresh,
  showBackLink = true,
}: ContentReviewPanelProps) {
  const [selectedVersion, setSelectedVersion] = useState<PostVersion | null>(
    null,
  );
  const [rejectOpen, setRejectOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [saveVersionLoading, setSaveVersionLoading] = useState(false);

  const preview = useMemo(() => {
    if (selectedVersion) {
      return {
        title: selectedVersion.title,
        copy: selectedVersion.copyText,
        mediaUrls: selectedVersion.mediaUrls,
        author: selectedVersion.createdBy,
        versionLabel: selectedVersion.versionLabel,
        isHistorical: true,
      };
    }

    return {
      title: post.title,
      copy: post.copy,
      mediaUrls: post.attachments.map((attachment) => attachment.url),
      author: post.author,
      versionLabel: null as string | null,
      isHistorical: false,
    };
  }, [post, selectedVersion]);

  const rejectionFeedback = history.feedback.filter(
    (entry) => entry.type === "rejection_reason",
  );

  const canReview =
    post.status === "pending_approval" ||
    post.status === "rejected" ||
    post.status === "approved";

  async function handleApprove() {
    if (
      !confirm(
        "Confirmar aprovação deste post? O status será alterado para Aprovado.",
      )
    ) {
      return;
    }

    setActionLoading(true);
    try {
      await contentService.approvePost(post.id);
      toast.success("Post aprovado com sucesso!");
      setSelectedVersion(null);
      await onRefresh();
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject(rejectionReason: string) {
    setActionLoading(true);
    try {
      await contentService.rejectPost(post.id, { rejectionReason });
      toast.success("Post rejeitado. O motivo foi registrado.");
      setSelectedVersion(null);
      await onRefresh();
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSaveVersion() {
    setSaveVersionLoading(true);
    try {
      await contentService.createPostVersion(post.id, {
        title: post.title,
        copyText: post.copy,
        mediaUrls: post.attachments.map((attachment) => attachment.url),
      });
      toast.success("Nova versão salva com sucesso!");
      setSelectedVersion(null);
      await onRefresh();
    } finally {
      setSaveVersionLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          {showBackLink && (
            <Button
              variant="outline"
              size="icon"
              render={<Link href="/content" />}
              className="shrink-0"
            >
              <ArrowLeft className="size-4" />
            </Button>
          )}
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <ContentStatusBadge status={post.status} />
              {preview.versionLabel && (
                <span className="rounded-full bg-[var(--atria-primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--atria-primary)]">
                  Visualizando {preview.versionLabel}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-[var(--atria-primary)]">
              {preview.title}
            </h1>
            <p className="text-sm text-[var(--atria-primary)]/50">
              {post.client.companyName} · {post.platform}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <VersionHistoryDrawer
            versions={history.versions}
            feedback={history.feedback}
            selectedVersionId={selectedVersion?.id}
            onSelectVersion={setSelectedVersion}
          />
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => void handleSaveVersion()}
            disabled={saveVersionLoading}
          >
            <Save className="size-4" />
            {saveVersionLoading ? "Salvando..." : "Salvar Versão"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className={LIQUID_GLASS_CLASS + " p-6"}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--atria-primary)]/50">
              Pré-visualização
            </h2>
            {preview.isHistorical && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedVersion(null)}
              >
                Voltar à versão atual
              </Button>
            )}
          </div>

          <div className="mb-4 flex items-center gap-2">
            <Avatar className="size-8 border border-[var(--atria-accent)]/40">
              {preview.author.avatarUrl && (
                <AvatarImage src={preview.author.avatarUrl} />
              )}
              <AvatarFallback className="bg-[var(--atria-accent)] text-[10px] text-[var(--atria-primary)]">
                {getInitials(preview.author.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-[var(--atria-primary)]">
                {preview.author.name}
              </p>
              <p className="text-xs text-[var(--atria-primary)]/40">
                {selectedVersion
                  ? formatContentDate(selectedVersion.createdAt)
                  : formatContentDate(post.updatedAt)}
              </p>
            </div>
          </div>

          <div className="mb-6 whitespace-pre-wrap text-sm leading-relaxed text-[var(--atria-primary)]">
            {preview.copy}
          </div>

          {preview.mediaUrls.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {preview.mediaUrls.map((url, index) => {
                const attachment = post.attachments.find(
                  (item) => item.url === url,
                );
                const isVideo = isMediaVideo(url, attachment?.mimeType);

                return (
                  <div
                    key={`${url}-${index}`}
                    className="overflow-hidden rounded-xl border border-white/30 bg-black/5"
                  >
                    {isVideo ? (
                      <video
                        src={url}
                        controls
                        className="aspect-video w-full object-cover"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={url}
                        alt={`Mídia ${index + 1}`}
                        className="aspect-video w-full object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {canReview && (
            <div className={LIQUID_GLASS_ACCENT_CLASS + " p-5"}>
              <h2 className="mb-4 text-sm font-semibold text-[var(--atria-primary)]">
                Aprovação
              </h2>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  className="gap-2 bg-green-600 text-white hover:bg-green-700"
                  onClick={() => void handleApprove()}
                  disabled={actionLoading || post.status === "approved"}
                >
                  <CheckCircle2 className="size-4" />
                  Aprovar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="gap-2"
                  onClick={() => setRejectOpen(true)}
                  disabled={actionLoading}
                >
                  <XCircle className="size-4" />
                  Rejeitar
                </Button>
              </div>
            </div>
          )}

          <div className={LIQUID_GLASS_CLASS + " p-5"}>
            <h2 className="mb-4 text-sm font-semibold text-[var(--atria-primary)]">
              Log de Rejeições
            </h2>
            {rejectionFeedback.length === 0 ? (
              <p className="text-sm text-[var(--atria-primary)]/50">
                Nenhuma rejeição registrada.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {rejectionFeedback.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-red-200/50 bg-red-50/50 p-3"
                  >
                    <p className="mb-2 text-sm text-[var(--atria-primary)]">
                      {entry.comment}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-[var(--atria-primary)]/60">
                        {entry.user.name}
                      </span>
                      <span className="text-[10px] text-[var(--atria-primary)]/40">
                        {formatContentDate(entry.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <RejectPostDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onConfirm={handleReject}
        loading={actionLoading}
      />
    </div>
  );
}
