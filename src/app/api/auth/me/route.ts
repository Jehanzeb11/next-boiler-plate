// ---------------------------------------------------------------------------
// GET /api/auth/me
//
// Two modes:
//   • Demo  — decodes the demo token locally and returns the profile.
//   • Production — proxies to the backend GET /auth/me.
// ---------------------------------------------------------------------------
import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { getSession } from "@/lib/session"
import type { User } from "@/types"

export const dynamic = "force-dynamic"

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim()
const IS_DEMO = API_BASE === ""

function getKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET?.trim()
  if (!secret) throw new Error("SESSION_SECRET is not set.")
  return new TextEncoder().encode(secret)
}

export async function GET() {
  const session = await getSession()
  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 })
  }

  // ── Demo mode: decode the locally-minted token ────────────────────────────
  if (IS_DEMO) {
    try {
      const { payload } = await jwtVerify(session.accessToken, getKey(), {
        algorithms: ["HS256"],
      })

      const user: User = {
        id: payload.sub ?? (payload.email as string),
        name: payload.name as string,
        email: payload.email as string,
        role: payload.role as User["role"],
      }

      return NextResponse.json(user)
    } catch {
      return NextResponse.json({ message: "Invalid session." }, { status: 401 })
    }
  }

  // ── Production mode: proxy to backend ─────────────────────────────────────
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
      cache: "no-store",
    })

    if (!res.ok) {
      return NextResponse.json({ message: "Unauthenticated." }, { status: res.status })
    }

    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ message: "Backend unavailable." }, { status: 503 })
  }
}
