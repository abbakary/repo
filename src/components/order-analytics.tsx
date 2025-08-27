"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts"
import { TrendingUp, TrendingDown, Clock, DollarSign, Users, CheckCircle } from "lucide-react"
import type { Order } from "@/lib/types"

interface OrderAnalyticsProps {
  orders: Order[]
}

export function OrderAnalytics({ orders }: OrderAnalyticsProps) {
  const analytics = useMemo(() => {
    // Basic metrics
    const totalOrders = orders.length
    const completedOrders = orders.filter(o => o.status === "completed").length
    const inProgressOrders = orders.filter(o => o.status === "in_progress").length
    const totalRevenue = orders.reduce((sum, order) => sum + order.final_amount, 0)
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Order type distribution
    const orderTypeData = [
      {
        name: "Car Service",
        value: orders.filter(o => o.order_type === "service").length,
        revenue: orders.filter(o => o.order_type === "service").reduce((sum, o) => sum + o.final_amount, 0),
        color: "#3B82F6"
      },
      {
        name: "Tire Sales", 
        value: orders.filter(o => o.order_type === "sales").length,
        revenue: orders.filter(o => o.order_type === "sales").reduce((sum, o) => sum + o.final_amount, 0),
        color: "#10B981"
      },
      {
        name: "Consultation",
        value: orders.filter(o => o.order_type === "consultation").length,
        revenue: orders.filter(o => o.order_type === "consultation").reduce((sum, o) => sum + o.final_amount, 0),
        color: "#6B7280"
      }
    ]

    // Status distribution
    const statusData = [
      { name: "Created", value: orders.filter(o => o.status === "created").length, color: "#F59E0B" },
      { name: "Assigned", value: orders.filter(o => o.status === "assigned").length, color: "#3B82F6" },
      { name: "In Progress", value: orders.filter(o => o.status === "in_progress").length, color: "#8B5CF6" },
      { name: "Completed", value: orders.filter(o => o.status === "completed").length, color: "#10B981" },
      { name: "Cancelled", value: orders.filter(o => o.status === "cancelled").length, color: "#EF4444" }
    ]

    // Daily order trends (mock data for last 7 days)
    const dailyTrends = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orders: Math.floor(Math.random() * 8) + 2,
        revenue: Math.floor(Math.random() * 500000) + 100000,
        services: Math.floor(Math.random() * 4) + 1,
        sales: Math.floor(Math.random() * 3) + 1,
        consultations: Math.floor(Math.random() * 2) + 1
      }
    })

    // Priority distribution
    const priorityData = [
      { name: "Low", value: orders.filter(o => o.priority === "low").length, color: "#6B7280" },
      { name: "Normal", value: orders.filter(o => o.priority === "normal").length, color: "#3B82F6" },
      { name: "High", value: orders.filter(o => o.priority === "high").length, color: "#F59E0B" },
      { name: "Urgent", value: orders.filter(o => o.priority === "urgent").length, color: "#EF4444" }
    ]

    // Performance metrics
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
    const avgCompletionTime = orders
      .filter(o => o.status === "completed" && o.actual_completion)
      .reduce((sum, order) => {
        const created = new Date(order.created_at).getTime()
        const completed = new Date(order.actual_completion!).getTime()
        return sum + (completed - created)
      }, 0) / Math.max(completedOrders, 1)

    return {
      totalOrders,
      completedOrders,
      inProgressOrders,
      totalRevenue,
      avgOrderValue,
      completionRate,
      avgCompletionTime: avgCompletionTime / (1000 * 60 * 60), // Convert to hours
      orderTypeData,
      statusData,
      dailyTrends,
      priorityData
    }
  }, [orders])

  const formatCurrency = (amount: number) => `TSH ${amount.toLocaleString()}`
  const formatDuration = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`
    return `${Math.round(hours * 10) / 10}h`
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{analytics.totalOrders}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className="text-xs">
                {analytics.inProgressOrders} in progress
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-xs text-green-600">
                Avg: {formatCurrency(analytics.avgOrderValue)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{Math.round(analytics.completionRate)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className="text-xs">
                {analytics.completedOrders} completed
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Completion Time</p>
                <p className="text-2xl font-bold">{formatDuration(analytics.avgCompletionTime)}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className="text-xs">
                Per order
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Type Distribution</CardTitle>
            <CardDescription>Breakdown by service type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.orderTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent || 0).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.orderTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, "Orders"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Current status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {analytics.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Trends */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Trends (Last 7 Days)</CardTitle>
            <CardDescription>Daily order volume and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={analytics.dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === "revenue" ? formatCurrency(value as number) : value,
                    name === "revenue" ? "Revenue" : "Orders"
                  ]}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="orders"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                  name="Total Orders"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Service Performance</CardTitle>
            <CardDescription>Detailed breakdown by service type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="services" fill="#3B82F6" name="Car Services" />
                <Bar dataKey="sales" fill="#10B981" name="Tire Sales" />
                <Bar dataKey="consultations" fill="#6B7280" name="Consultations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>Order priority levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Analysis</CardTitle>
          <CardDescription>Revenue breakdown by service type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {analytics.orderTypeData.map((type) => (
              <div key={type.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{type.name}</h4>
                  <Badge style={{ backgroundColor: type.color, color: "white" }}>
                    {type.value} orders
                  </Badge>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(type.revenue)}</p>
                <p className="text-sm text-muted-foreground">
                  Avg: {formatCurrency(type.value > 0 ? type.revenue / type.value : 0)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
