import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const OverviewSkeleton = () => {
  return (
    <>
      {/* Top row: 4 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px] mb-2" />
              <Skeleton className="h-3 w-[160px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom row: Charts and Detailed Content */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 mt-4">
        {/* Hourly Requests Skeleton (Chart area) */}
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-5 w-[140px]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="ps-2">
            {/* Matching the 350px height of the actual chart */}
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>

        {/* Recent Sales Skeleton */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-5 w-[120px] mb-2" />
            </CardTitle>
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Placeholder for "Recent Sales" list items */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
                <div className="ml-auto">
                  <Skeleton className="h-4 w-[60px]" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default OverviewSkeleton
