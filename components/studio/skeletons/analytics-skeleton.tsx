import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const AnalyticsSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Traffic Overview Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-[140px]" />
          </CardTitle>
          <Skeleton className="h-4 w-[240px] mt-1" />
        </CardHeader>
        <CardContent className="px-6">
          {/* Skeleton for the TrafficChart (300px height) */}
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>

      {/* Grid of 4 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[120px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[80px] mb-2" />
              <Skeleton className="h-3 w-[100px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Grid: Top API Keys Skeletons */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        {/* Top 10 API Keys (This Week) - col-span-4 */}
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-5 w-[200px]" />
            </CardTitle>
            <Skeleton className="h-4 w-[180px] mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* SimpleBarList placeholders */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-[100px]" />
                  <Skeleton className="h-3 w-[40px]" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top 10 API Keys (All Time) - col-span-3 */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-5 w-[180px]" />
            </CardTitle>
            <Skeleton className="h-4 w-[140px] mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* SimpleBarList placeholders */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-[100px]" />
                  <Skeleton className="h-3 w-[30px]" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AnalyticsSkeleton
