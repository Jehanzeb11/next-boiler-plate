"use client"
// ---------------------------------------------------------------------------
// TanStack Query hooks for the /users resource
// ---------------------------------------------------------------------------
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { queryKeys } from "@/lib/query-keys"
import type { User } from "@/types"

// ─── GET list ────────────────────────────────────────────────────────────────

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: () => apiClient.get<User[]>("/users"),
  })
}

// ─── GET single ──────────────────────────────────────────────────────────────

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => apiClient.get<User>(`/users/${id}`),
    enabled: Boolean(id),
  })
}

// ─── CREATE ──────────────────────────────────────────────────────────────────

export function useCreateUser() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: Omit<User, "id" | "createdAt">) =>
      apiClient.post<User, typeof payload>("/users", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users.all }),
  })
}

// ─── UPDATE ──────────────────────────────────────────────────────────────────

export function useUpdateUser(id: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: Partial<Omit<User, "id" | "createdAt">>) =>
      apiClient.patch<User, typeof payload>(`/users/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.detail(id) })
      qc.invalidateQueries({ queryKey: queryKeys.users.all })
    },
  })
}

// ─── DELETE ──────────────────────────────────────────────────────────────────

export function useDeleteUser() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users.all }),
  })
}
