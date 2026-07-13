import { create } from "zustand"
import { devtools } from "zustand/middleware"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface UIState {
  sidebarOpen: boolean
  theme: "light" | "dark" | "system"
}

interface UIActions {
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: UIState["theme"]) => void
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
export const useUIStore = create<UIState & UIActions>()(
  devtools(
    (set) => ({
      // State
      sidebarOpen: true,
      theme: "system",

      // Actions
      toggleSidebar: () =>
        set((s) => ({ sidebarOpen: !s.sidebarOpen }), false, "ui/toggleSidebar"),

      setSidebarOpen: (open) =>
        set({ sidebarOpen: open }, false, "ui/setSidebarOpen"),

      setTheme: (theme) =>
        set({ theme }, false, "ui/setTheme"),
    }),
    { name: "UIStore" }
  )
)
