"use client"

// ---------------------------------------------------------------------------
// Providers wrapper
// All Client Component providers live here. Keeps layout.tsx clean and lets
// you add/remove providers in one place.
// ---------------------------------------------------------------------------

import QueryProvider from "@/app/Client/QueryClientNo_SSR"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {/* Add more client providers here as the app grows, e.g. a ThemeProvider */}
      {children}
    </QueryProvider>
  )
}
