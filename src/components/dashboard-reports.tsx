import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { RefreshCw, Calendar, TrendingUp, Users, Clock, DollarSign, Wrench } from "lucide-react"
import { Badge } from "./ui/badge"

export function DashboardReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("daily")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const getReportData = () => {
    const baseData = {
      daily: {
        period: "Today",
        services: 12,
        customers: 8,
        revenue: 145000,
        avgTime: "2.5 hrs",
        completedJobs: 10,
        pendingJobs: 2
      },
      weekly: {
        period: "This Week",
        services: 78,
        customers: 45,
        revenue: 950000,
        avgTime: "2.8 hrs",
        completedJobs: 65,
        pendingJobs: 13
      },
      monthly: {
        period: "This Month",
        services: 324,
        customers: 189,
        revenue: 4250000,
        avgTime: "2.6 hrs",
        completedJobs: 298,
        pendingJobs: 26
      },
      yearly: {
        period: "This Year",
        services: 3890,
        customers: 1456,
        revenue: 48500000,
        avgTime: "2.7 hrs",
        completedJobs: 3654,
        pendingJobs: 236
      }
    }
    return baseData[selectedPeriod as keyof typeof baseData]
  }

  const reportData = getReportData()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Report Tracking Status</h3>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {reportData.period} Summary
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Services</p>
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-blue-500" />
                <p className="text-2xl font-bold">{reportData.services}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Customers</p>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <p className="text-2xl font-bold">{reportData.customers}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Revenue</p>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-yellow-500" />
                <p className="text-2xl font-bold">TSH {(reportData.revenue / 1000).toFixed(0)}K</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Avg Time</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <p className="text-2xl font-bold">{reportData.avgTime}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Completed</p>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-2xl font-bold">{reportData.completedJobs}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Pending</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  {reportData.pendingJobs}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
