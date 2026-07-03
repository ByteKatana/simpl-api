"use client"
import * as React from "react"
import { useEffect } from "react"
import { useAppStore, primaryColors } from "@/hooks/use-app-store"

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const primaryColor = useAppStore((state) => state.primaryColor)

  useEffect(() => {
    const config = primaryColors[primaryColor] || primaryColors["red"]
    const hue = config.hue

    // Apply the hue to the root element and body for robustness
    document.documentElement.style.setProperty("--primary-hue", hue)
    document.body.style.setProperty("--primary-hue", hue)

    // Apply overrides
    const root = document.documentElement
    const body = document.body

    const setProp = (name: string, value?: string) => {
      if (value) {
        root.style.setProperty(name, value)
        body.style.setProperty(name, value)
      } else {
        root.style.removeProperty(name)
        body.style.removeProperty(name)
      }
    }

    setProp("--primary-l-override", config.l)
    setProp("--primary-c-override", config.c)
    setProp("--sidebar-primary-l-override", config.sidebarL)
    setProp("--sidebar-primary-c-override", config.sidebarC)
    setProp("--primary-l-dark-override", config.darkL)
    setProp("--primary-c-dark-override", config.darkC)
    setProp("--sidebar-primary-l-dark-override", config.darkSidebarL)
    setProp("--sidebar-primary-c-dark-override", config.darkSidebarC)
  }, [primaryColor])

  return <>{children}</>
}
