import { getSession, verifyIdentityToken } from "@/server/session"
import { LogoutButton } from "@/features/auth/components/logout-button"
import { APP_NAME, IS_DEMO_MODE } from "@/constants"
import type { User } from "@/types"

export async function Header() {
  const session = await getSession()
  if (!session) return null

  const user = await resolveUser(session.accessToken)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <span className="text-sm font-semibold text-zinc-900 dark:text-white">
          {APP_NAME}
        </span>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <span className="hidden sm:block text-xs text-zinc-500 dark:text-zinc-400">
                {user.name ?? user.email}
              </span>
              <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 capitalize">
                {user.role}
              </span>
            </>
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}

/**
 * Resolve a display-safe user identity from the access token.
 *
 * Demo mode: verifies the signed JWT locally — never trusts unverified bytes.
 * Production mode: calls /api/auth/me on the backend (swap the fetch below).
 */
async function resolveUser(
  accessToken: string
): Promise<Pick<User, "email" | "name" | "role"> | null> {
  if (IS_DEMO_MODE) {
    const identity = await verifyIdentityToken(accessToken)
    if (!identity) return null
    return {
      email: identity.email,
      name: identity.name,
      role: identity.role as User["role"],
    }
  }

  // Production: verify the JWT with the backend's public key OR call /auth/me.
  // Swap this with your preferred strategy when you have a real backend.
  // Example: return apiServer.get<Pick<User, "email" | "name" | "role">>("/auth/me")
  return null
}
