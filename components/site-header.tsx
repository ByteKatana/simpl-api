"use client"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { SearchCommand } from "@/components/search-command"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { ColorSwitcher } from "@/components/color-switcher"
import { usePathname } from "next/navigation"
import React from "react"

export function SiteHeader() {
  const pathname = usePathname()

  // Split pathname into segments and filter out empty strings
  const segments = pathname.split("/").filter(Boolean)

  // Helper to format segment names (e.g., "entry-types" -> "Entry Types")
  const formatSegment = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {/* Always show Studio as the first item if we are in /studio */}
          <BreadcrumbItem>
            <BreadcrumbLink href="/studio">Studio</BreadcrumbLink>
          </BreadcrumbItem>

          {segments.length > 1 && <BreadcrumbSeparator />}

          {segments.slice(1).map((segment, index) => {
            const href = `/${segments.slice(0, index + 2).join("/")}`
            const isLast = index === segments.length - 2
            const label = formatSegment(segment)

            return (
              <React.Fragment key={href}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            )
          })}

          {/* Fallback for Dashboard when exactly at /studio */}
          {segments.length === 1 && segments[0] === "studio" && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Home</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-4">
        <SearchCommand />
        <ThemeSwitcher />
        <ColorSwitcher />
      </div>
    </header>
  )
}
