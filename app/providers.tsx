"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { Session } from "next-auth"

export function Providers({ children, session }: { children: ReactNode; session?: Session }) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}
