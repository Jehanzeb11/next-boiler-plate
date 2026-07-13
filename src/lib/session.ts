// ---------------------------------------------------------------------------
// Session — server-only
//
// Stores the backend-issued token inside a signed, httpOnly cookie so it is
// never accessible to client-side JavaScript.  No user data is stored here;
// the backend is the source of truth.
// ---------------------------------------------------------------------------
import "server-only"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

// ─── Constants ───────────────────────────────────────────────────────────────

export const SESSION_COOKIE = "session"
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

// ─── Types ───────────────────────────────────────────────────────────────────

/** Minimal payload stored in the cookie — backend token + expiry only. */
export interface SessionPayload {
  /** Raw token issued by the backend (JWT, opaque token, etc.) */
  accessToken: string
  expiresAt: number // unix ms
}

// ─── Crypto ──────────────────────────────────────────────────────────────────

function getEncodedKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET?.trim()
  if (!secret) throw new Error("SESSION_SECRET is not set.")
  return new TextEncoder().encode(secret)
}

async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getEncodedKey())
}

async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getEncodedKey(), {
      algorithms: ["HS256"],
    })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

// ─── Public helpers ──────────────────────────────────────────────────────────

/** Seal the backend token into an httpOnly cookie. */
export async function createSession(accessToken: string): Promise<void> {
  const expiresAt = Date.now() + SESSION_DURATION_MS
  const sealed = await encrypt({ accessToken, expiresAt })
  const store = await cookies()

  store.set(SESSION_COOKIE, sealed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  })
}

/** Return the session payload, or null if missing / expired / tampered. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies()
  const raw = store.get(SESSION_COOKIE)?.value
  if (!raw) return null

  const payload = await decrypt(raw)
  if (!payload || payload.expiresAt < Date.now()) return null

  return payload
}

/** Remove the session cookie (logout). */
export async function deleteSession(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

/** Slide the cookie expiry window — call from proxy.ts on each request. */
export async function refreshSession(raw: string): Promise<string | null> {
  const payload = await decrypt(raw)
  if (!payload) return null
  const expiresAt = Date.now() + SESSION_DURATION_MS
  return encrypt({ ...payload, expiresAt })
}
