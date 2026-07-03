"use client"

import { useRef, useCallback, useMemo, useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import getLogs from "@/lib/actions/studio/stats/get-logs"
import { Skeleton } from "@/components/ui/skeleton"

const Logs = () => {
  // 1. Filter States
  const [logType, setLogType] = useState("api")
  const [isRateLimited, setIsRateLimited] = useState<string>("all")
  const [rateLimitType, setLogRateLimitType] = useState("ALL")
  const [limit, setLimit] = useState(10)

  // 2. TanStack Infinite Query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    // The queryKey includes all filter states.
    // Changing any of these will automatically reset pagination to page 0.
    queryKey: ["logs", isRateLimited, rateLimitType, limit],
    queryFn: ({ pageParam = 0 }) =>
      getLogs({
        isRateLimited: isRateLimited === "all" ? undefined : isRateLimited === "yes",
        rateLimitType: rateLimitType === "ALL" ? undefined : rateLimitType,
        skip: pageParam,
        take: limit
      }),
    getNextPageParam: (lastPage, allPages) => {
      // Calculates the next 'skip' value based on total pages loaded so far
      const currentSkip = allPages.length * limit
      return lastPage.data?.hasMore ? currentSkip : undefined
    },
    initialPageParam: 0,
    refetchInterval: 10000
  })

  // 3. Flatten pages into a single logs array
  const logs = useMemo(() => data?.pages.flatMap((page) => page.data?.logs || []) || [], [data])
  const total = data?.pages[0]?.data?.total || 0

  // 4. Infinite Scroll Intersection Observer
  const observer = useRef<IntersectionObserver | null>(null)
  const lastLogElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observer.current.observe(node)
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  )

  const getRowClassName = (log: any) => {
    let className = "p-4 border-b flex flex-col space-y-1 transition-colors "
    if (log.isRateLimited) {
      className += "bg-amber-400/50 "
    } else if (log.apiKey === "RATELIMIT-ERROR" || log.apiKey === "UNAUTHORIZED") {
      className += "bg-primary/75 text-white "
    } else if (log.apiKey === "NO-LIMIT") {
      className += "bg-slate-400 "
    }
    return className
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Log Type Filter */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium">Log Type</label>
          <Select value={logType} onValueChange={setLogType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Log Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="api">API Logs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rate Limit Status Filter */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium">Is Rate Limited</label>
          <Select value={isRateLimited} onValueChange={setIsRateLimited}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Rate Limited?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rate Limit Type Filter */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium">Rate Limit Type</label>
          <Select value={rateLimitType} onValueChange={setLogRateLimitType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Limit Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="TIME-INTERVAL">Time Interval</SelectItem>
              <SelectItem value="REQ-PER-WINDOW">Req Per Window</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Batch Size Selection */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium">Display</label>
          <Select value={limit.toString()} onValueChange={(v) => setLimit(parseInt(v))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Logs ({total})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-150 overflow-y-auto" id="logs-container">
            {logs.map((log, index) => (
              <div
                key={log.id}
                ref={index === logs.length - 1 ? lastLogElementRef : null}
                className={getRowClassName(log)}>
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs truncate max-w-[70%]">{log.endpoint.split("?")[0]}</span>
                  <span className="text-xs opacity-70 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${log.apiKey === "UNAUTHORIZED" ? "text-white" : ""} `}>
                      Key: {log.apiKey}...
                    </Badge>
                    {log.rateLimitType && (
                      <Badge variant="destructive" className="text-[10px]">
                        {log.rateLimitType}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-bold">{log.responseTime}ms</span>
                </div>
                <div className="text-[10px] opacity-60">IP: {log.ipAddress}</div>
              </div>
            ))}

            {(isLoading || isFetchingNextPage) && (
              <div className="p-4 space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            )}

            {!hasNextPage && logs.length > 0 && (
              <div className="p-4 text-center text-xs text-muted-foreground">No more logs to load.</div>
            )}

            {!isLoading && logs.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">No logs found.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Logs
