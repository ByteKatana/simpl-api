import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Analytics from "@/components/studio/analytics"
import Overview from "@/components/studio/overview"
import Logs from "@/components/studio/logs"

export default function StudioPage() {
  return (
    <div className="flex flex-col justify-around space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{/* More content here later */}</div>
      <Tabs orientation="horizontal" defaultValue="overview" className="space-y-4">
        <div className="w-full overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="logs">API Logs</TabsTrigger>
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
        <TabsContent value="logs" className="space-y-4">
          <Logs />
        </TabsContent>
      </Tabs>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 py-5">{/* More content here later */}</div>
    </div>
  )
}
