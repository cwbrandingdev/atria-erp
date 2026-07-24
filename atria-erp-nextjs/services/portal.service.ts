import { apiRequest, uploadFile, API_BASE_URL } from "./api";
import type {
  ClientReport,
  PortalBrief,
  PortalContractDetail,
  PortalData,
  ReportContentPost,
} from "./types";

export async function getPortalData(token: string) {
  return apiRequest<PortalData>(`/portal/${token}`, { skipAuth: true });
}

export async function getPortalReport(token: string, reportId: string) {
  return apiRequest<ClientReport>(`/portal/${token}/reports/${reportId}`, {
    skipAuth: true,
  });
}

export async function getPortalPost(token: string, postId: string) {
  return apiRequest<ReportContentPost & { versions?: unknown[] }>(
    `/portal/${token}/posts/${postId}`,
    { skipAuth: true },
  );
}

export async function approvePortalPost(token: string, postId: string) {
  return apiRequest<ReportContentPost>(
    `/portal/${token}/posts/${postId}/approve`,
    { method: "PATCH", skipAuth: true },
  );
}

export async function rejectPortalPost(
  token: string,
  postId: string,
  rejectionReason: string,
) {
  return apiRequest<ReportContentPost>(
    `/portal/${token}/posts/${postId}/reject`,
    {
      method: "PATCH",
      body: { rejectionReason },
      skipAuth: true,
    },
  );
}

export async function getPortalContract(token: string, contractId: string) {
  return apiRequest<PortalContractDetail>(
    `/portal/${token}/contracts/${contractId}`,
    { skipAuth: true },
  );
}

export async function signPortalContract(token: string, contractId: string) {
  return apiRequest<unknown>(`/portal/${token}/contracts/${contractId}/sign`, {
    method: "PATCH",
    skipAuth: true,
  });
}

export async function uploadPortalAsset(
  token: string,
  file: File,
  fileType?: string,
) {
  const formData = new FormData();
  formData.append("file", file);
  const query = fileType ? `?fileType=${encodeURIComponent(fileType)}` : "";
  return uploadFile<{ id: string; fileName: string; fileUrl: string }>(
    `/portal/${token}/assets/upload${query}`,
    formData,
    { skipAuth: true },
  );
}

export async function submitPortalBriefing(
  token: string,
  data: { title: string; content: string },
) {
  return apiRequest<PortalBrief>(`/portal/${token}/briefings`, {
    method: "POST",
    body: data,
    skipAuth: true,
  });
}

export function resolvePortalAssetUrl(url: string) {
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
}
