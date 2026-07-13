// ---------------------------------------------------------------------------
// Query Key Factory
// Centralised, typed query keys for TanStack Query.
// ---------------------------------------------------------------------------

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },

  users: {
    all: ["users"] as const,
    list: (filters?: Record<string, unknown>) => ["users", "list", filters] as const,
    detail: (id: string) => ["users", "detail", id] as const,
  },

  // Add more domains as the app grows:
  // products: { all: ["products"] as const, ... },
  // dashboard: { stats: ["dashboard", "stats"] as const, ... },
} as const
