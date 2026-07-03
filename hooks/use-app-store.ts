import { create } from "zustand"
import { persist } from "zustand/middleware"

export type PrimaryColor = "red" | "slate" | "emerald" | "amber" | "indigo" | "rose"

export interface ColorConfig {
  hue: string
  l?: string
  c?: string
  sidebarL?: string
  sidebarC?: string
  darkL?: string
  darkC?: string
  darkSidebarL?: string
  darkSidebarC?: string
}

export const primaryColors: Record<PrimaryColor, ColorConfig> = {
  red: { hue: "27.518" },
  slate: { l: "0.372", c: "0.044", darkL: "0.554", darkC: "0.046", hue: "257.287" },
  emerald: { l: "0.696", c: "0.17", darkL: "0.696", darkC: "0.17", hue: "162.48" },
  amber: {
    hue: "70.08",
    l: "0.769",
    c: "0.188",
    sidebarL: "0.8",
    sidebarC: "0.19",
    darkL: "0.7",
    darkC: "0.15",
    darkSidebarL: "0.75",
    darkSidebarC: "0.16"
  },
  indigo: { l: "0.585", c: "0.233", darkL: "0.585", darkC: "0.233", hue: "277.117" },
  rose: { l: "0.645", c: "0.246", darkL: "0.645", darkC: "0.246", hue: "16.439" }
}

interface AppState {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  primaryColor: PrimaryColor
  setPrimaryColor: (color: PrimaryColor) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      primaryColor: "red",
      setPrimaryColor: (color) => set({ primaryColor: color })
    }),
    {
      name: "app-storage"
    }
  )
)
