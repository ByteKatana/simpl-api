"use client"
import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { Session } from "next-auth"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ColorProvider } from "@/components/color-provider"
import { QueryClient } from "@tanstack/query-core"
import { QueryClientProvider } from "@tanstack/react-query"

export function Providers({ children, session }: { children: ReactNode; session?: Session }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false
      }
    }
  })

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ColorProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ColorProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
