import { getSession } from "@/lib/session"
import { LogoutButton } from "@/components/auth/logout-button"
import type { User } from "@/types"

export async function Header() {
  const session = await getSession()
  if (!session) return null

  // Decode the demo token (base64url-encoded JSON) to get user info.
  // In production this would be a JWT verified with your backend's public key,
  // or a separate /auth/me call — swap this function out when the backend is ready.
  const user = decodeSessionUser(session.accessToken)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <span className="text-sm font-semibold text-zinc-900 dark:text-white">
          LI Boomers Panel
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

function decodeSessionUser(token: string): Pick<User, "email" | "name" | "role"> | null {
  try {
    const json = Buffer.from(token, "base64url").toString("utf8")
    return JSON.parse(json) as Pick<User, "email" | "name" | "role">
  } catch {
    return null
  }
}
