"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { SearchCommand } from "@/components/search-command"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import Link from "next/link"

function StudioLayoutContent({ children }: { children: React.ReactNode }) {
  const { side } = useSidebar()

  return (
    <div className="flex min-h-screen w-full">
      {side === "left" && <AppSidebar />}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-4 shrink-0">
          <div className="flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/studio" passHref>
                    <div>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>Dashboard</NavigationMenuLink>
                    </div>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/studio/projects" passHref>
                    <div>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>Projects</NavigationMenuLink>
                    </div>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center gap-4">
            <SearchCommand />
            <ThemeSwitcher />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
      {side === "right" && <AppSidebar />}
    </div>
  )
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false} defaultSide="right">
      <StudioLayoutContent>{children}</StudioLayoutContent>
    </SidebarProvider>
  )
}
