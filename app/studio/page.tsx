import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TotalRequests from "@/components/studio/total-requests"
import { HourlyRequests } from "@/components/studio/hourly-requests"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Analytics from "@/components/studio/analytics"
import Overview from "@/components/studio/overview"

export default function StudioPage() {
  return (
    <div className="flex flex-col justify-around space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">Top Content</div>
      <Tabs orientation="horizontal" defaultValue="overview" className="space-y-4">
        <div className="w-full overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Reports
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Notifications
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <Overview />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Analytics />
        </TabsContent>
      </Tabs>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 py-5">Footer Content</div>
    </div>
  )
}
