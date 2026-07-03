import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { SiteHeader } from "@/components/site-header"
import { getSettingsValue } from "@/lib/actions/studio/settings/get-settings-value"
import { Construction } from "lucide-react"

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  //Check Maintanence
  const isMaintenance = await getSettingsValue("general_settings", "maintenance_mode")
  if (isMaintenance) {
    const message = await getSettingsValue("general_settings", "maintenance_msg")
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4 gap-5">
        <div>
          <Construction size={128} className="text-primary animate-pulse" />
        </div>
        <div className="w-full max-w-[600px]">
          <h1 className="text-4xl font-bold">Maintenance Mode</h1>
          <p className="text-lg text-muted-foreground">{message}</p>
        </div>
      </div>
    )
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
