"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { hasPermission } from "@/lib/actions/auth/has-permission"

interface PermissionGuardProps {
  reqPermission: string[]
  children: React.ReactNode
  isPage?: boolean // Set to true if this guard wraps a full page
  showMsg?: boolean
}

export const PermissionGuard = ({ reqPermission, children, isPage = false, showMsg = false }: PermissionGuardProps) => {
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkPermission = async () => {
      let isAllowed = false
      for (const perm of reqPermission) {
        const permType = perm.split(".")[0]
        isAllowed = await hasPermission(perm)
        // If the user has the system permission, they're always allowed
        if (permType === "system" && isAllowed) break
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
    if (showMsg) {
      return (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-lg font-bold mb-4 text-destructive">Unauthorized</h1>
          <p className="text-base text-gray-600">You do not have permission to do this action.</p>
        </div>
      )
    }
    return null
  }

  // If authorized, display children
  return <>{children}</>
}
