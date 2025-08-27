"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useUser } from "@/lib/user-context"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "blue" | "green" | "orange" | "teal"
}

function StatCard({ title, value, subtitle, trend, color = "blue" }: StatCardProps) {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    orange: "text-orange-600",
    teal: "text-primary",
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {trend && (
          <Badge variant={trend.isPositive ? "default" : "destructive"} className="text-xs">
            {trend.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {Math.abs(trend.value)}%
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  const { isAdmin, currentUser } = useUser()

  // Admin sees all business metrics including manager oversight
  const adminStats = [
    {
      title: "Today's Services",
      value: "26",
      subtitle: "Car Services: 18 • Tyre Sales: 6 • Consultations: 2",
      color: "blue" as const,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Total Revenue",
      value: "TSH 2,450,000",
      subtitle: "Services: TSH 1,800,000 • Parts: TSH 650,000",
      color: "green" as const,
      trend: { value: 15, isPositive: true }
    },
    {
      title: "Manager Activities",
      value: "156",
      subtitle: "Today: 12 • Access Denials: 3 • Completed: 89%",
      color: "orange" as const,
      trend: { value: 8, isPositive: true }
    },
    {
      title: "System Overview",
      value: "98%",
      subtitle: "Active Users: 2 • Inventory Items: 847 • Uptime: 99.9%",
      color: "teal" as const,
      trend: { value: 2, isPositive: true }
    }
  ]

  // Managers see operational metrics for their work
  const managerStats = [
    {
      title: "My Job Cards",
      value: "8",
      subtitle: "In Progress: 5 • Completed Today: 3",
      color: "blue" as const,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Customer Visits",
      value: "48",
      subtitle: "New: 32 • Returning: 16 • Assigned to me: 8",
      color: "teal" as const,
      trend: { value: 5, isPositive: true }
    },
    {
      title: "My Revenue",
      value: "TSH 850,000",
      subtitle: "Services processed by me today",
      color: "green" as const,
      trend: { value: 10, isPositive: true }
    },
    {
      title: "Task Completion",
      value: "94%",
      subtitle: "Efficiency rate • Average time: 2.3hrs",
      color: "orange" as const,
      trend: { value: 3, isPositive: true }
    }
  ]

  const statsToShow = isAdmin ? adminStats : managerStats

  return (
    <div className="space-y-4">
      {isAdmin && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Admin Dashboard Overview</h2>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Full Access Mode
          </Badge>
        </div>
      )}

      {!isAdmin && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Manager Dashboard</h2>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Manager View
          </Badge>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsToShow.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            color={stat.color}
            trend={stat.trend}
          />
        ))}
      </div>
    </div>
  )
}
