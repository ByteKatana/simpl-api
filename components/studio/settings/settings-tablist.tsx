"use client"
import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { TabsTrigger } from "@/components/ui/tabs"

const SettingsTablist = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const updateParam = useCallback((param: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(param, value)
    router.push(`${pathname}?${params.toString()}`)
  })
  return (
    <>
      <TabsTrigger onClick={() => updateParam("tab", "general")} value="general">
        General
      </TabsTrigger>
      <TabsTrigger onClick={() => updateParam("tab", "identity")} value="identity">
        Identity
      </TabsTrigger>
      <TabsTrigger onClick={() => updateParam("tab", "permission-groups")} value="permission-groups">
        Permission Groups
      </TabsTrigger>
      <TabsTrigger onClick={() => updateParam("tab", "api")} value="api">
        API
      </TabsTrigger>
      <TabsTrigger onClick={() => updateParam("tab", "appearance")} value="appearance">
        Appearance
      </TabsTrigger>
      <TabsTrigger disabled value="webhooks">
        Webhooks
      </TabsTrigger>
      <TabsTrigger disabled value="mcp">
        MCP
      </TabsTrigger>
    </>
  )
}
export default SettingsTablist
