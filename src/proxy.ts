// ---------------------------------------------------------------------------
// Proxy — Next.js 16 (renamed from middleware)
//
// Responsibilities:
//   1. Redirect unauthenticated visitors to /login
//   2. Redirect authenticated visitors away from /login
//   3. Slide the session cookie expiry on every authenticated request
// ---------------------------------------------------------------------------
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE, refreshSession } from "@/lib/session"

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

/** Paths that do not require authentication. */
const PUBLIC_PATHS = ["/login"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))

  const rawToken = request.cookies.get(SESSION_COOKIE)?.value
  const isAuthenticated = Boolean(rawToken)

  // ── Authenticated → bounce away from /login ───────────────────────────────
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // ── Unauthenticated → redirect to /login ─────────────────────────────────
  if (!isAuthenticated && !isPublic) {
    const url = new URL("/login", request.url)
    if (pathname !== "/") url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // ── Authenticated → slide the session cookie ─────────────────────────────
  const response = NextResponse.next()

  if (isAuthenticated && rawToken) {
    const newToken = await refreshSession(rawToken)
    if (newToken) {
      response.cookies.set(SESSION_COOKIE, newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(Date.now() + SESSION_DURATION_MS),
      })
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
