import { ApiError } from "./errors";
import { clearStoredTokens, getStoredTokens, setStoredTokens } from "./session";
import type { AuthTokens } from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000/api/v1";

function browserAwareApiBaseUrl() {
  if (typeof window === "undefined") return API_BASE_URL;
  try {
    const configured = new URL(API_BASE_URL);
    const current = window.location;
    const configuredIsLocal =
      configured.hostname === "localhost" || configured.hostname === "127.0.0.1";
    const currentIsLan =
      current.hostname !== "localhost" && current.hostname !== "127.0.0.1";
    if (configuredIsLocal && currentIsLan) {
      return `${current.protocol}//${current.hostname}:8000/api/v1`;
    }
  } catch {
    return API_BASE_URL;
  }
  return API_BASE_URL;
}

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
  retryOnUnauthorized?: boolean;
};

async function parsePayload(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();
  const text = await response.text();
  return text ? { detail: text } : null;
}

async function refreshAccessToken(refresh: string): Promise<AuthTokens | null> {
  const response = await fetch(`${browserAwareApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  if (!data.access) return null;
  return { access: data.access, refresh };
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { auth = true, retryOnUnauthorized = true, headers, body, ...init } = options;
  const tokens = getStoredTokens();
  const requestHeaders = new Headers(headers);

  if (!(body instanceof FormData) && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (auth && tokens?.access) {
    requestHeaders.set("Authorization", `Bearer ${tokens.access}`);
  }

  const response = await fetch(`${browserAwareApiBaseUrl()}${path}`, {
    ...init,
    body,
    headers: requestHeaders,
  });

  if (response.status === 401 && auth && retryOnUnauthorized && tokens?.refresh) {
    const refreshed = await refreshAccessToken(tokens.refresh);
    if (refreshed) {
      setStoredTokens(refreshed);
      return apiRequest<T>(path, { ...options, retryOnUnauthorized: false });
    }
    clearStoredTokens();
  }

  if (!response.ok) {
    throw new ApiError(response.status, await parsePayload(response), response.statusText);
  }

  if (response.status === 204) return undefined as T;
  return parsePayload(response) as Promise<T>;
}

export function toQuery(params: Record<string, string | number | boolean | undefined | null>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
