"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { hasPermission } from "@/lib/actions/auth/has-permission"

interface PermissionGuardProps {
  reqPermission: string[]
  children: React.ReactNode
  isPage?: boolean // Set to true if this guard wraps a full page
}

export const PermissionGuard = ({ reqPermission, children, isPage = false }: PermissionGuardProps) => {
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkPermission = async () => {
      let isAllowed = false
      for (const perm of reqPermission) {
        const permType = perm.split(".")[0]
        isAllowed = await hasPermission(perm)
        // If the user has the system permission, they're always allowed
        if (permType === "system" && isAllowed) {
          isAllowed = true
          break
        }
      }
      setAuthorized(isAllowed)

      if (!isAllowed && isPage) {
        router.push("/unauthorized")
      }
    }

    checkPermission()
  }, [reqPermission, isPage, router])

  // While checking, show nothing (or a loading spinner if preferred)
  if (authorized === null) {
    return null
  }

  // If not authorized, return null (it won't display)
  if (!authorized) {
    return null
  }

  // If authorized, display children
  return <>{children}</>
}
