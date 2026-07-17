"use client"

// ---------------------------------------------------------------------------
// Providers wrapper
// All Client Component providers live here. Keeps layout.tsx clean.
// ---------------------------------------------------------------------------
import QueryProvider from "@/lib/query-client"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  )
}
