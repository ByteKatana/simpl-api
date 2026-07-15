"use client"

import { useState, useEffect, useTransition, useCallback } from "react"
import { useRouter } from "next/navigation"
import { RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { TimerReset } from "lucide-react"

export default function RefreshCountdown() {
  const [countdown, setCountdown] = useState(30)
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()
  const router = useRouter()

  const handleRefresh = useCallback(() => {
    startTransition(async () => {
      await queryClient.invalidateQueries()
      router.refresh()
      setCountdown(30)
    })
  }, [queryClient, router])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 30
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [handleRefresh])

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="font-mono h-7 px-2 min-w-21.25 justify-center text-xs">
        <TimerReset />
        {isPending ? "Refreshing..." : `${countdown}s`}
      </Badge>
      <Button
        variant="outline"
        size="icon-xs"
        onClick={handleRefresh}
        disabled={isPending}
        title="Refresh data"
      >
        <RefreshCcw className={cn("size-3", isPending && "animate-spin")} />
      </Button>
    </div>
  )
}