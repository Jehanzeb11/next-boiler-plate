// ---------------------------------------------------------------------------
// Demo accounts — server-only
// Used when NEXT_PUBLIC_API_BASE_URL is not set. Remove once backend is live.
// ---------------------------------------------------------------------------
import "server-only"
import type { User } from "@/types"

export interface DemoAccount {
  email: string
  password: string
  user: Omit<User, "createdAt">
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: "admin@example.com",
    password: "Admin@1234",
    user: { id: "demo-1", name: "Admin User", email: "admin@example.com", role: "admin" },
  },
  {
    email: "manager@example.com",
    password: "Manager@1234",
    user: { id: "demo-2", name: "Jane Manager", email: "manager@example.com", role: "manager" },
  },
  {
    email: "viewer@example.com",
    password: "Viewer@1234",
    user: { id: "demo-3", name: "View Only", email: "viewer@example.com", role: "viewer" },
  },
]

export function findDemoAccount(email: string, password: string): DemoAccount | undefined {
  return DEMO_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
  )
}
