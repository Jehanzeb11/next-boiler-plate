// ---------------------------------------------------------------------------
// fetcher — thin re-export for TanStack Query queryFn usage
//
// Prefer apiClient for new code; this exists for backwards compatibility
// with existing hooks that spread options into a plain fetch call.
// ---------------------------------------------------------------------------
export { apiClient as fetcher, ApiRequestError as FetchError } from "@/lib/api-client"
