import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const TotalRequests = () => {
  const calcPercentage = (lastMonth: number, currentMonth: number) => {
    return ((currentMonth - lastMonth) / lastMonth) * 100
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">798,562</div>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
      </CardContent>
    </Card>
  )
}
export default TotalRequests
