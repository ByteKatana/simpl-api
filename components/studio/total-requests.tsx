import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type TotalRequestsProps = {
  value: number
  change: number
}

const TotalRequests = ({ value, change }: TotalRequestsProps) => {
  const calcPercentage = (lastMonth: number, currentMonth: number) => {
    return ((currentMonth - lastMonth) / lastMonth) * 100
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">+{calcPercentage(change, value).toFixed(2)}% from last month</p>
      </CardContent>
    </Card>
  )
}
export default TotalRequests
