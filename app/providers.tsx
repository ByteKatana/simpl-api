"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { Session } from "next-auth"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children, session }: { children: ReactNode; session?: Session }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
