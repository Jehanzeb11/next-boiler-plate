// ---------------------------------------------------------------------------
// fetcher — thin re-export for TanStack Query queryFn usage
// Prefer apiClient for new code.
// ---------------------------------------------------------------------------
export { apiClient as fetcher, ApiRequestError as FetchError } from "@/server/api-client"
