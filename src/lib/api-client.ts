// ---------------------------------------------------------------------------
// API Client
//
// A thin wrapper around fetch that:
//   • Prefixes every request with NEXT_PUBLIC_API_BASE_URL
//   • Attaches the Authorization header from the session cookie (server-side)
//     or from the /api/auth/token internal route (client-side)
//   • Normalises errors into a typed ApiError
//   • Supports query params, typed request/response bodies
//
// Usage:
//   Server Components / Server Actions:
//     import { apiServer } from "@/lib/api-client"
//     const data = await apiServer.get<Product[]>("/products")
//
//   Client Components (via TanStack Query):
//     import { apiClient } from "@/lib/api-client"
//     const data = await apiClient.get<Product[]>("/products")
// ---------------------------------------------------------------------------

import type { ApiError } from "@/types"

// ─── Constants ───────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

// ─── Error class ─────────────────────────────────────────────────────────────

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: ApiError
  ) {
    super(body.message ?? statusText)
    this.name = "ApiRequestError"
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export interface RequestOptions<TBody = unknown> {
  params?: Record<string, string | number | boolean | null | undefined>
  body?: TBody
  headers?: Record<string, string>
  /** Next.js server-only cache option — ignored on the client */
  next?: NextFetchRequestConfig
}

// ─── Core fetch ──────────────────────────────────────────────────────────────

async function request<TResponse, TBody = unknown>(
  method: HttpMethod,
  path: string,
  options: RequestOptions<TBody> & { token?: string } = {}
): Promise<TResponse> {
  const { params, body, headers: extraHeaders, next, token } = options

  // Build full URL
  const url = new URL(`${API_BASE}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null) url.searchParams.set(k, String(v))
    })
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...extraHeaders,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
    ...(next ? { next } : {}),
  })

  if (!res.ok) {
    let errorBody: ApiError = { status: res.status, message: res.statusText }
    try {
      errorBody = await res.json()
    } catch {
      // Response body is not JSON — keep the default
    }
    throw new ApiRequestError(res.status, res.statusText, errorBody)
  }

  // 204 No Content
  if (res.status === 204) return undefined as TResponse

  return res.json() as Promise<TResponse>
}

// ─── Server-side client (reads session cookie) ───────────────────────────────
// Import this only in Server Components, Server Actions, and Route Handlers.
// It automatically reads the httpOnly session cookie and forwards the token.

function makeServerClient() {
  async function getToken(): Promise<string | undefined> {
    // Lazy import — this module is server-only and must not be bundled client-side
    const { getSession } = await import("@/lib/session")
    const session = await getSession()
    return session?.accessToken
  }

  return {
    get: async <T>(path: string, opts?: RequestOptions) =>
      request<T>("GET", path, { ...opts, token: await getToken() }),

    post: async <T, B = unknown>(path: string, body?: B, opts?: RequestOptions<B>) =>
      request<T, B>("POST", path, { ...opts, body, token: await getToken() }),

    put: async <T, B = unknown>(path: string, body?: B, opts?: RequestOptions<B>) =>
      request<T, B>("PUT", path, { ...opts, body, token: await getToken() }),

    patch: async <T, B = unknown>(path: string, body?: B, opts?: RequestOptions<B>) =>
      request<T, B>("PATCH", path, { ...opts, body, token: await getToken() }),

    delete: async <T>(path: string, opts?: RequestOptions) =>
      request<T>("DELETE", path, { ...opts, token: await getToken() }),
  }
}

export const apiServer = makeServerClient()

// ─── Browser client (calls /api/auth/token to retrieve token) ────────────────
// Import this in Client Components for use with TanStack Query.

async function getBrowserToken(): Promise<string | undefined> {
  try {
    const res = await fetch("/api/auth/token", { credentials: "include" })
    if (!res.ok) return undefined
    const json = (await res.json()) as { accessToken?: string }
    return json.accessToken
  } catch {
    return undefined
  }
}

function makeBrowserClient() {
  return {
    get: async <T>(path: string, opts?: RequestOptions) =>
      request<T>("GET", path, { ...opts, token: await getBrowserToken() }),

    post: async <T, B = unknown>(path: string, body?: B, opts?: RequestOptions<B>) =>
      request<T, B>("POST", path, { ...opts, body, token: await getBrowserToken() }),

    put: async <T, B = unknown>(path: string, body?: B, opts?: RequestOptions<B>) =>
      request<T, B>("PUT", path, { ...opts, body, token: await getBrowserToken() }),

    patch: async <T, B = unknown>(path: string, body?: B, opts?: RequestOptions<B>) =>
      request<T, B>("PATCH", path, { ...opts, body, token: await getBrowserToken() }),

    delete: async <T>(path: string, opts?: RequestOptions) =>
      request<T>("DELETE", path, { ...opts, token: await getBrowserToken() }),
  }
}

export const apiClient = makeBrowserClient()
