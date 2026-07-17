// ---------------------------------------------------------------------------
// App-wide constants
// ---------------------------------------------------------------------------

// ─── Session ─────────────────────────────────────────────────────────────────

export const SESSION_COOKIE = "session"
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** Routes that do not require authentication. */
export const PUBLIC_PATHS = ["/login"] as const

// ─── API ──────────────────────────────────────────────────────────────────────

/**
 * NEXT_PUBLIC_ variables are inlined at build time by the Next.js compiler,
 * so this value is baked into the bundle — it is intentionally public.
 * Server-side code that needs the same value should read this constant
 * rather than process.env directly to keep a single source of truth.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

/**
 * True when no external backend is configured.
 * In demo mode the app signs its own tokens locally using SESSION_SECRET.
 * Evaluated at module-load time; changing NEXT_PUBLIC_API_BASE_URL requires
 * a rebuild (it is a build-time constant, not a runtime env var).
 */
export const IS_DEMO_MODE = API_BASE_URL.trim() === ""

// ─── App ──────────────────────────────────────────────────────────────────────

export const APP_NAME = "LI Boomers Panel"
export const APP_DESCRIPTION = "Admin panel"
