const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("atria_token");
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;

  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      (data as { message?: string })?.message ?? "Request failed",
      response.status,
      data,
    );
  }

  return data as T;
}
