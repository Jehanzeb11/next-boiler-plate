// ---------------------------------------------------------------------------
// POST /api/auth/logout
//
// Clears the session cookie.  Optionally notifies the backend to
// invalidate the token server-side (if your backend supports it).
// ---------------------------------------------------------------------------
import { NextResponse } from "next/server"
import { deleteSession, getSession } from "@/lib/session"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

export async function POST() {
  const session = await getSession()

  // Best-effort: tell the backend to revoke the token
  if (session?.accessToken) {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      })
    } catch {
      // Ignore — we always clear the local cookie regardless
    }
  }

  await deleteSession()

  return NextResponse.json({ ok: true })
}
