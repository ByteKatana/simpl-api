"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar"
import {
  Home,
  Settings,
  Users,
  Folder,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
  LucideFileText,
  Box,
  ShieldUser,
  Webhook,
  Signpost
} from "lucide-react"

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home
  },
  {
    title: "Entry Types",
    url: "/studio/entry-types",
    icon: Box
  },
  {
    title: "Entries",
    url: "/studio/entries",
    icon: LucideFileText
  },
  {
    title: "Permission Groups",
    url: "/studio/permission-groups",
    icon: ShieldUser
  },
  {
    title: "Users",
    url: "/studio/users",
    icon: Users
  },
  {
    title: "Routes",
    url: "#",
    icon: Signpost
  },
  {
    title: "Webhooks",
    url: "#",
    icon: Webhook
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { side, setSide } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Folder className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">simpl:api</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger className="w-full justify-start gap-2 px-2">
              <PanelLeft className="size-4" />
              <span>Collapse Menu</span>
            </SidebarTrigger>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setSide(side === "left" ? "right" : "left")}
              tooltip={`Move to ${side === "left" ? "right" : "left"}`}>
              {side === "left" ? <ChevronRight /> : <ChevronLeft />}
              <span>Move to {side === "left" ? "right" : "left"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
