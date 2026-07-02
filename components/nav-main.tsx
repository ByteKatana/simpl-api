"use client"

import { Box, Home, LucideFileText, Settings, ShieldUser, Users } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import Link from "next/link"
const items = [
  { title: "Home", url: "/studio", icon: Home },
  { title: "Entry Types", url: "/studio/entry-types", icon: Box },
  { title: "Entries", url: "/studio/entries", icon: LucideFileText },
  { title: "Permission Groups", url: "/studio/permission-groups", icon: ShieldUser },
  { title: "Users", url: "/studio/users", icon: Users },
  {
    title: "Settings",
    url: "/studio/settings",
    icon: Settings
  }
]
export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
