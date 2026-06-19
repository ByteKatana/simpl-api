"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrafficChart } from "@/components/studio/traffic-chart"
import getAnalyticsStats from "@/lib/actions/studio/stats/get-analytics-stats"
import AnalyticsSkeleton from "@/components/studio/skeletons/analytics-skeleton"
import { useQuery } from "@tanstack/react-query"

const Analytics = () => {
  const { data: statsResponse, isLoading } = useQuery({
    queryKey: ["analytics-stats"],
    queryFn: () => getAnalyticsStats(),
    refetchInterval: 30000
  })

  if (isLoading || !statsResponse || !statsResponse.success) return <AnalyticsSkeleton />

  const stats = statsResponse.data

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>Weekly requests and unique api keys</CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <TrafficChart data={stats.trafficData} />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Request (Weekly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequestStats.count.toLocaleString()}</div>
            <p className="text-muted-foreground text-xs">
              {stats.totalRequestStats.change >= 0 ? "+" : ""}
              {stats.totalRequestStats.change}% vs last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueRequestStats.count.toLocaleString()}</div>
            <p className="text-muted-foreground text-xs">
              {stats.uniqueRequestStats.change >= 0 ? "+" : ""}
              {stats.uniqueRequestStats.change}% vs last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limit Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rateLimitStats.percentage}%</div>
            <p className="text-muted-foreground text-xs">
              {stats.rateLimitStats.change >= 0 ? "+" : ""}
              {stats.rateLimitStats.change}% vs last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}ms</div>
            <p className="text-muted-foreground text-xs">system average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Top 10 API Keys (This Week)</CardTitle>
            <CardDescription>Most active keys in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList
              items={stats.topKeysThisWeek}
              barClass="bg-primary"
              valueFormatter={(n) => `${n} requests`}
            />
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Top 10 API Keys (All Time)</CardTitle>
            <CardDescription>Historical top usage</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList items={stats.topKeysAllTime} barClass="bg-muted-foreground" valueFormatter={(n) => `${n}`} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SimpleBarList({
  items,
  valueFormatter,
  barClass
}: {
  items: { name: string; value: number }[]
  valueFormatter: (n: number) => string
  barClass: string
}) {
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <ul className="space-y-3">
      {items.map((i) => {
        const width = `${Math.round((i.value / max) * 100)}%`
        return (
          <li key={i.name} className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-muted-foreground mb-1 truncate text-xs">{i.name}</div>
              <div className="bg-muted h-2.5 w-full rounded-full">
                <div className={`h-2.5 rounded-full ${barClass}`} style={{ width }} />
              </div>
            </div>
            <div className="ps-2 text-xs font-medium tabular-nums">{valueFormatter(i.value)}</div>
          </li>
        )
      })}
    </ul>
  )
}

export default Analytics
