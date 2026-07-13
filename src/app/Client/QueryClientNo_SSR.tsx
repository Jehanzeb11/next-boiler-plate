"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Don't refetch immediately on the client if server already provided data
        staleTime: 60 * 1000,
        // Retry once on failure instead of the default 3 times
        retry: 1,
        // Don't refetch when window regains focus in a panel/dashboard context
        refetchOnWindowFocus: false,
      },
    },
  })
}

// Browser singleton — one instance for the lifetime of the browser session
let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always a new client so data is never shared between requests
    return makeQueryClient()
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // useState keeps the client stable across re-renders without a module-level
  // variable that could leak between server requests
  const [queryClient] = useState(() => getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
