"use client"
// ---------------------------------------------------------------------------
// Global error boundary — catches uncaught errors in the React tree.
// Next.js requires this to be a Client Component.
// ---------------------------------------------------------------------------
import { useEffect } from "react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to your error monitoring service (Sentry, Datadog, etc.) here
    console.error("[GlobalError]", error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-md text-center space-y-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-950">
          <svg
            className="w-7 h-7 text-red-600 dark:text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Something went wrong
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            An unexpected error occurred. Our team has been notified.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-600 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:ring-offset-2"
        >
          Try again
        </button>
      </div>
    </main>
  )
}
