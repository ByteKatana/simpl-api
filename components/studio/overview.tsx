"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TotalRequests from "@/components/studio/total-requests"
import { HourlyRequests } from "@/components/studio/hourly-requests"
import OverviewSkeleton from "@/components/studio/skeletons/overview-skeleton"
import getOverviewStats from "@/lib/actions/studio/stats/get-overview-stats"
import { useQuery } from "@tanstack/react-query"

const Overview = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["overviw-stats"],
    queryFn: () => getOverviewStats(),
    refetchInterval: 30000
  })

  if (isLoading || !stats) return <OverviewSkeleton />

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TotalRequests value={stats.totalRequests} change={stats.requestChangeMonthly} />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span> {stats.totalEntries.toLocaleString()}</span>
              <p className="text-xs text-muted-foreground">
                {stats.entriesCreatedLastMonth >= 0
                  ? `+${stats.entriesCreatedLastMonth}`
                  : stats.entriesCreatedLastMonth}{" "}
                since last month
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entry Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEntryTypes.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActiveUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.userChangeSinceLastMonth >= 0
                ? `+${stats.userChangeSinceLastMonth}`
                : stats.userChangeSinceLastMonth}{" "}
              since last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Hourly Requests</CardTitle>
          </CardHeader>
          <CardContent className="ps-2">
            <HourlyRequests data={stats.hourlyData} />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent API Requests</CardTitle>
            <CardDescription>Latest requests processed by the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentRequests.map((req: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="grid gap-1">
                    <p className="font-medium truncate max-w-[380px]">{req.endpoint.split("?")[0]}</p>
                    <p className="text-xs text-muted-foreground">Key: {req.apiKey}...</p>
                  </div>
                  <div className="font-medium">{req.responseTime}ms</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
export default Overview
